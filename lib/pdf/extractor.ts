import zlib from "zlib";

/**
 * Robust zero-dependency PDF text extractor.
 * Unpacks PDF binary ArrayBuffers, decompresses FlateDecode streams,
 * and extracts text strings enclosed in (text) or <hex> within BT...ET text objects.
 */
export function extractTextFromPdfBuffer(buffer: Buffer): string {
  try {
    const textChunks: string[] = [];
    const pdfString = buffer.toString("binary");

    // Locate stream objects inside PDF
    const streamRegex = /stream[\r\n]+([\s\S]*?)[\r\n]+endstream/g;
    let match: RegExpExecArray | null;

    while ((match = streamRegex.exec(pdfString)) !== null) {
      const streamContent = match[1];
      let decompressed = streamContent;

      // Try zlib inflate/gunzip for FlateDecode compressed streams
      try {
        const chunkBuffer = Buffer.from(streamContent, "binary");
        const inflated = zlib.inflateSync(chunkBuffer);
        decompressed = inflated.toString("utf8");
      } catch (e) {
        // If not zlib compressed or raw stream, use original content
        try {
          const rawInflate = zlib.inflateRawSync(Buffer.from(streamContent, "binary"));
          decompressed = rawInflate.toString("utf8");
        } catch (e2) {
          decompressed = streamContent;
        }
      }

      // Extract text content from BT ... ET text blocks
      const btRegex = /BT[\s\S]*?ET/g;
      let btMatch: RegExpExecArray | null;

      while ((btMatch = btRegex.exec(decompressed)) !== null) {
        const btBlock = btMatch[0];

        // Extract string literals in parentheses (hello world)
        const strRegex = /\(([\s\S]*?)\)\s*(?:Tj|TJ|\')/g;
        let strMatch: RegExpExecArray | null;
        while ((strMatch = strRegex.exec(btBlock)) !== null) {
          const rawStr = strMatch[1]
            .replace(/\\\( /g, "(")
            .replace(/\\\)/g, ")")
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t")
            .replace(/\\/g, "");
          if (rawStr.trim().length > 1) {
            textChunks.push(rawStr.trim());
          }
        }

        // Extract TJ array text elements [ (Hello) -10 (World) ]
        const tjRegex = /\[([\s\S]*?)\]\s*TJ/g;
        let tjMatch: RegExpExecArray | null;
        while ((tjMatch = tjRegex.exec(btBlock)) !== null) {
          const tjArray = tjMatch[1];
          const innerStrRegex = /\(([\s\S]*?)\)/g;
          let innerMatch: RegExpExecArray | null;
          while ((innerMatch = innerStrRegex.exec(tjArray)) !== null) {
            const clean = innerMatch[1].replace(/\\/g, "").trim();
            if (clean.length > 0) {
              textChunks.push(clean);
            }
          }
        }
      }
    }

    // Fallback: If FlateDecode extraction yielded nothing, extract all printable ASCII strings
    if (textChunks.length === 0) {
      const asciiMatches = pdfString.match(/[\x20-\x7E\s]{4,}/g) || [];
      const filtered = asciiMatches.filter(
        (s) =>
          !s.includes("/Filter") &&
          !s.includes("/Length") &&
          !s.includes("/Font") &&
          !s.includes("endobj") &&
          !s.includes("obj") &&
          !s.includes("xref") &&
          !s.includes("/Type") &&
          !s.includes("/Page") &&
          s.trim().length > 2
      );
      if (filtered.length > 0) {
        textChunks.push(...filtered.map((s) => s.trim()));
      }
    }

    const resultText = textChunks
      .join(" ")
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\uFFFD]/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return resultText;
  } catch (err) {
    console.error("PDF Extraction error:", err);
    return "";
  }
}
