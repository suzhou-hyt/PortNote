import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/prisma/generated/prisma'; 

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
    try {
        const servers = await prisma.server.findMany();
        const ports = await prisma.port.findMany();

        const serversWithPorts = servers.map(server => ({
            ...server,
            ports: ports.filter(port => port.serverId === server.id)
        }));
        
        return NextResponse.json(serversWithPorts);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}