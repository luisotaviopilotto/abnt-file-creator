import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const arrayBuffer = await req.arrayBuffer();

    // Vercel Blob requires BLOB_READ_WRITE_TOKEN — fallback to base64 data URL if not available
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      const base64 = Buffer.from(arrayBuffer).toString("base64");
      const dataUrl = `data:application/pdf;base64,${base64}`;
      return NextResponse.json({ url: dataUrl, type: "dataurl" });
    }

    const { put, del } = await import("@vercel/blob");
    const filename = `pdf/${Date.now()}_Trabalho_ABNT.pdf`;

    const { url } = await put(filename, arrayBuffer, {
      access: "public",
      contentType: "application/pdf",
    });

    // Delete after 5 minutes
    setTimeout(async () => {
      try { await del(url); } catch { /* ignore */ }
    }, 5 * 60 * 1000);

    return NextResponse.json({ url, type: "blob" });
  } catch (err) {
    console.error("[POST /api/pdf-upload]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
