import { NextRequest, NextResponse } from "next/server";

// GET /api/documents/:id — load a document
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { default: db } = await import("@/lib/db");
    const { id } = await params;
    const row = db.prepare("SELECT state FROM documents WHERE id = ?").get(id) as { state: string } | undefined;
    if (!row) return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });
    return NextResponse.json(JSON.parse(row.state));
  } catch (err) {
    console.error("[GET /api/documents/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// PATCH /api/documents/:id — update a document and log the change
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { default: db } = await import("@/lib/db");
    const { id } = await params;
    const existing = db.prepare("SELECT id FROM documents WHERE id = ?").get(id);
    if (!existing) return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });

    const state = await req.json();
    const now = new Date().toISOString();

    db.prepare("UPDATE documents SET state = ?, updated_at = ? WHERE id = ?")
      .run(JSON.stringify(state), now, id);

    db.prepare("INSERT INTO change_logs (document_id, snapshot, changed_at) VALUES (?, ?, ?)")
      .run(id, JSON.stringify(state), now);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PATCH /api/documents/:id]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
