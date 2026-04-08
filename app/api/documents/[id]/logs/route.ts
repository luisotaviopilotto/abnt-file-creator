import { NextRequest, NextResponse } from "next/server";

// GET /api/documents/:id/logs — list change history
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { default: db } = await import("@/lib/db");
    const { id } = await params;
    const logs = db.prepare(
      "SELECT id, changed_at FROM change_logs WHERE document_id = ? ORDER BY changed_at DESC LIMIT 50"
    ).all(id) as { id: number; changed_at: string }[];
    return NextResponse.json(logs);
  } catch (err) {
    console.error("[GET /api/documents/:id/logs]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
