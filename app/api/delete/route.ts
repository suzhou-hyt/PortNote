import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@/app/generated/prisma';

const prisma = new PrismaClient();

interface DeleteRequest {
  type: number;
  id: number;
}

export async function DELETE(request: NextRequest) {
  try {
    const body: DeleteRequest = await request.json();
    const { type, id } = body;

    if (type === 0) { // Server
      await prisma.server.delete({
        where: { id }
      });
    } else { // Port
      await prisma.port.delete({
        where: { id }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}