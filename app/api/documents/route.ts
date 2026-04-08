import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

// POST /api/documents — create a new shared document
export async function POST(req: NextRequest) {
  try {
    const { default: db } = await import("@/lib/db");
    const state = await req.json();
    const id = nanoid(10);
    const now = new Date().toISOString();

    db.prepare(
      "INSERT INTO documents (id, state, created_at, updated_at) VALUES (?, ?, ?, ?)"
    ).run(id, JSON.stringify(state), now, now);

    db.prepare(
      "INSERT INTO change_logs (document_id, snapshot, changed_at) VALUES (?, ?, ?)"
    ).run(id, JSON.stringify(state), now);

    return NextResponse.json({ id });
  } catch (err) {
    console.error("[POST /api/documents]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
