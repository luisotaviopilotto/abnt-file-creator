import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const state = await req.json();

    const doc = await prisma.document.create({
      data: { state },
    });

    return NextResponse.json({ id: doc.id });
  } catch (err) {
    console.error("[POST /api/documents]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
