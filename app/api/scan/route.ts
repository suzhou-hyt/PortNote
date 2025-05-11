import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/prisma/generated/prisma'; 

const prisma = new PrismaClient();

interface ScanRequest {
    serverId: number;
}

export async function POST(request: NextRequest) {
    try {
        const body: ScanRequest = await request.json();
        const { serverId } = body;

    const scan = await prisma.scan.create({
        data: {
            serverId
        }
    });

    return NextResponse.json({message: "Success"})
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}