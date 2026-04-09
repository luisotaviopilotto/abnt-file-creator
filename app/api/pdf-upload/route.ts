import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

// This route handles the client-upload token handshake with Vercel Blob
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ["application/pdf"],
        maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
        tokenPayload: JSON.stringify({ ts: Date.now() }),
      }),
      onUploadCompleted: async () => {
        // Nothing to do — deletion is handled client-side via a separate call
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (err) {
    console.error("[POST /api/pdf-upload]", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
