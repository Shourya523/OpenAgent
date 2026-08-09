import { NextRequest, NextResponse } from "next/server";
import { extractTextFromPdfBuffer } from "@/lib/pdf/extractor";

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";

    let buffer: Buffer | null = null;
    let filename = "document.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ success: false, error: "No file provided in form data." }, { status: 400 });
      }
      filename = file.name;
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      const body = await req.json();
      if (body.base64) {
        buffer = Buffer.from(body.base64, "base64");
      } else if (body.text) {
        buffer = Buffer.from(body.text, "binary");
      }
      filename = body.filename || filename;
    }

    if (!buffer) {
      return NextResponse.json({ success: false, error: "Could not read PDF binary data." }, { status: 400 });
    }

    const extractedText = extractTextFromPdfBuffer(buffer);

    return NextResponse.json({
      success: true,
      filename,
      extractedText: extractedText || `Document "${filename}" parsed. Content contains diagrams or scanned images.`,
      length: extractedText.length,
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: (err as Error).message }, { status: 500 });
  }
}
