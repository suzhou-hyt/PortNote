package main

import (
	"fmt"
	"net"
	"os"
	"sort"
	"sync"
	"time"
)

func main() {
	if len(os.Args) != 2 {
		fmt.Println("Usage: ./portscan <target-ip>")
		return
	}

	targetIP := os.Args[1]
	if net.ParseIP(targetIP) == nil {
		fmt.Println("Invalid IP address")
		return
	}

	const (
		timeout    = 100 * time.Millisecond
		numWorkers = 2000
		maxPort    = 65535
	)

	ports := make(chan int, 10000)
	results := make(chan int)
	var openPorts []int
	var wg sync.WaitGroup

	// Start worker goroutines
	for i := 0; i < numWorkers; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for port := range ports {
				conn, err := net.DialTimeout("tcp", fmt.Sprintf("%s:%d", targetIP, port), timeout)
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

	// Close results channel when all workers finish
	go func() {
		wg.Wait()
		close(results)
	}()

	// Collect results
	for port := range results {
		openPorts = append(openPorts, port)
	}

	// Sort and print results
	sort.Ints(openPorts)
	fmt.Println("Open ports:")
	for _, port := range openPorts {
		fmt.Println(port)
	}
}
