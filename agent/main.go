package main

import (
	"context"
	"fmt"
	"net"
	"os"
	"sort"
	"sync"
	"time"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

const (
	scanInterval = 10 * time.Second
	scanTimeout  = 750 * time.Millisecond
	workerCount  = 2000
	maxPort      = 65535
	dbMaxConns   = 5
)

var (
	connString = os.Getenv("DATABASE_URL") // Changed to var
)

type Server struct {
	ID int
	IP string
}

func main() {
	dbConfig, err := pgxpool.ParseConfig(connString)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error parsing connection string: %v\n", err)
		os.Exit(1)
	}
	dbConfig.MaxConns = dbMaxConns

	dbPool, err := pgxpool.ConnectConfig(context.Background(), dbConfig)
	if err != nil {
		fmt.Fprintf(os.Stderr, "Unable to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer dbPool.Close()

	ticker := time.NewTicker(scanInterval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			processScans(dbPool)
		}
	}
}

func processScans(db *pgxpool.Pool) {
	ctx := context.Background()

	rows, err := db.Query(ctx, `SELECT "serverId" FROM "Scan"`)
	if err != nil {
		fmt.Printf("Error fetching scans: %v\n", err)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var serverID int
		if err := rows.Scan(&serverID); err != nil {
			fmt.Printf("Error scanning row: %v\n", err)
			continue
		}

		var server Server
		err := db.QueryRow(ctx,
			`SELECT id, ip FROM "Server" WHERE id = $1`, serverID).Scan(&server.ID, &server.IP)
		if err != nil {
			fmt.Printf("Error fetching server %d: %v\n", serverID, err)
			continue
		}

		openPorts := scanPorts(server.IP)

		if err := savePorts(db, server.ID, openPorts); err != nil {
			fmt.Printf("Error saving ports: %v\n", err)
			continue
		}

		_, err = db.Exec(ctx, `DELETE FROM "Scan" WHERE "serverId" = $1`, serverID)
		if err != nil {
			fmt.Printf("Error deleting scan entry: %v\n", err)
		}
	}
}

func scanPorts(ip string) []int {
	ports := make(chan int, 10000)
	results := make(chan int)
	var openPorts []int
	var wg sync.WaitGroup

	// Start workers
	for i := 0; i < workerCount; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for port := range ports {
				conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", ip, port), scanTimeout)
				if err == nil {
					conn.Close()
					results <- port
				}
			}
		}()
	}

	// Send ports to workers
	go func() {
		for port := 1; port <= maxPort; port++ {
			ports <- port
		}
		close(ports)
	}()

	// Close results channel when done
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	for port := range results {
		openPorts = append(openPorts, port)
	}

	sort.Ints(openPorts)
	return openPorts
}

func savePorts(db *pgxpool.Pool, serverID int, ports []int) error {
	ctx := context.Background()

	existingPorts := make(map[int]struct{})
	rows, err := db.Query(ctx, `SELECT port FROM "Port" WHERE "serverId" = $1`, serverID)
	if err != nil {
		return fmt.Errorf("error querying existing ports: %w", err)
	}
	defer rows.Close()

	for rows.Next() {
		var port int
		if err := rows.Scan(&port); err != nil {
			return fmt.Errorf("error scanning port: %w", err)
		}
		existingPorts[port] = struct{}{}
	}

	var newPorts []int
	for _, port := range ports {
		if _, exists := existingPorts[port]; !exists {
			newPorts = append(newPorts, port)
		}
	}

	if len(newPorts) == 0 {
		return nil
	}

	batch := &pgx.Batch{}
	for _, port := range newPorts {
		batch.Queue(
			`INSERT INTO "Port" ("serverId", port) VALUES ($1, $2)`,
			serverID,
			port,
		)
	}

	results := db.SendBatch(ctx, batch)
	defer results.Close()

	_, err = results.Exec()
	if err != nil {
		return fmt.Errorf("batch insert error: %w", err)
	}

	return nil
}
