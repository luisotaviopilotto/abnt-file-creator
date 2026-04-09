import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });
    return NextResponse.json(doc.state);
  } catch (err) {
    console.error("[GET /api/documents/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const state = await req.json();

    const doc = await prisma.document.update({
      where: { id },
      data: {
        state,
        changeLogs: { create: { snapshot: state } },
      },
    });

    return NextResponse.json({ ok: true, updatedAt: doc.updatedAt });
  } catch (err) {
    console.error("[PATCH /api/documents/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/documents/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
