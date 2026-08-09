import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogle } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const { provider, apiKey, model } = await req.json();

    if (!apiKey || typeof apiKey !== "string") {
      return NextResponse.json({ error: "Missing or invalid API key." }, { status: 400 });
    }

    const cleanKey = apiKey.trim();

    if (provider === "gemini") {
      const googleSDK = createGoogle({ apiKey: cleanKey });
      const testModel = model || "gemini-2.5-flash";
      const result = await generateText({
        model: googleSDK(testModel),
        prompt: "Respond with 'OK'",
        maxTokens: 5,
      } as any);

      if (result && result.text) {
        return NextResponse.json({ success: true, text: result.text });
      }
    }

    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return NextResponse.json({ error: errJson.error?.message || "Invalid OpenAI API Key" }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    if (provider === "groq") {
      const response = await fetch("https://api.groq.com/openai/v1/models", {
        headers: { Authorization: `Bearer ${cleanKey}` },
      });
      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return NextResponse.json({ error: errJson.error?.message || "Invalid Groq API Key" }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    if (provider === "anthropic") {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": cleanKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: model || "claude-3-haiku-20240307",
          max_tokens: 5,
          messages: [{ role: "user", content: "Hi" }],
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        return NextResponse.json({ error: errJson.error?.message || "Invalid Anthropic API Key" }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
  } catch (error) {
    console.error("Test connection error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
