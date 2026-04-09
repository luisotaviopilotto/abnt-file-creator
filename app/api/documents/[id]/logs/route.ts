import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const logs = await prisma.changeLog.findMany({
      where: { documentId: id },
      orderBy: { changedAt: "desc" },
      take: 50,
      select: { id: true, changedAt: true },
    });
    return NextResponse.json(logs);
  } catch (err) {
    console.error("[GET /api/documents/:id/logs]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
