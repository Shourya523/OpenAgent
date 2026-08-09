import { NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogle } from "@ai-sdk/google";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      provider,
      apiKey,
      model,
      systemInstruction,
      userPrompt,
      messagesHistory = [],
      availableTools = [],
    } = body;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key is required to run the agent." }, { status: 400 });
    }

    const cleanKey = apiKey.trim();

    // Prepare system instructions & tool descriptions for JSON tool call formatting
    let toolPromptInstruction = "";
    if (availableTools.length > 0) {
      toolPromptInstruction = `\n\nYOU HAVE ACCESS TO THE FOLLOWING TOOLS:\n` +
        availableTools.map((t: any) => `- ${t.name}: ${t.description}. Input schema: ${JSON.stringify(t.inputSchema)}`).join("\n") +
        `\n\nIMPORTANT TOOL CALLING RULE:
If you need to use a tool to fulfill the user request, respond ONLY with a valid JSON block inside triple backticks with "tool_call":
\`\`\`json
{
  "tool_call": {
    "name": "TOOL_NAME",
    "arguments": { ... }
  }
}
\`\`\`
If you do NOT need any tool, or after receiving tool results, provide your final friendly answer directly to the student.`;
    }

    const fullSystemPrompt = (systemInstruction || "You are a helpful AI assistant.") + toolPromptInstruction;

    // Handle Provider: Google Gemini
    if (provider === "gemini") {
      const googleSDK = createGoogle({ apiKey: cleanKey });
      const activeModel = model || "gemini-2.5-flash";

      const promptInput = messagesHistory.length > 0
        ? messagesHistory.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join("\n") + `\nUSER: ${userPrompt}`
        : userPrompt;

      const response = await generateText({
        model: googleSDK(activeModel),
        system: fullSystemPrompt,
        prompt: promptInput,
        temperature: 0.2,
      } as any);

      const responseText = response.text || "";

      // Parse JSON tool call if generated
      const toolCallMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/(\{\s*"tool_call"[\s\S]*?\})/);
      if (toolCallMatch) {
        try {
          const parsed = JSON.parse(toolCallMatch[1] || toolCallMatch[0]);
          if (parsed.tool_call) {
            return NextResponse.json({
              text: responseText.replace(/```json[\s\S]*?```/, "").trim(),
              toolCalls: [{
                id: `call_${Date.now()}`,
                name: parsed.tool_call.name,
                arguments: parsed.tool_call.arguments || {},
              }],
            });
          }
        } catch (e) {
          // Fallback to plain text
        }
      }

      return NextResponse.json({ text: responseText });
    }

    // Handle Provider: OpenAI or Groq (OpenAI Compatible)
    if (provider === "openai" || provider === "groq") {
      const baseUrl = provider === "groq" ? "https://api.groq.com/openai/v1" : "https://api.openai.com/v1";
      const activeModel = model || (provider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini");

      const apiMessages = [
        { role: "system", content: fullSystemPrompt },
        ...messagesHistory.map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
        { role: "user", content: userPrompt }
      ];

      const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cleanKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: activeModel,
          messages: apiMessages,
          temperature: 0.2,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return NextResponse.json({ error: errJson.error?.message || `${provider} API request failed` }, { status: 400 });
      }

      const data = await res.json();
      const responseText = data.choices?.[0]?.message?.content || "";

      // Parse JSON tool call if generated
      const toolCallMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/(\{\s*"tool_call"[\s\S]*?\})/);
      if (toolCallMatch) {
        try {
          const parsed = JSON.parse(toolCallMatch[1] || toolCallMatch[0]);
          if (parsed.tool_call) {
            return NextResponse.json({
              text: responseText.replace(/```json[\s\S]*?```/, "").trim(),
              toolCalls: [{
                id: `call_${Date.now()}`,
                name: parsed.tool_call.name,
                arguments: parsed.tool_call.arguments || {},
              }],
            });
          }
        } catch (e) {
          // Plain text fallback
        }
      }

      return NextResponse.json({ text: responseText });
    }

    // Handle Provider: Anthropic Claude
    if (provider === "anthropic") {
      const activeModel = model || "claude-3-5-sonnet-20241022";
      const apiMessages = [
        ...messagesHistory.map((m: any) => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })),
        { role: "user", content: userPrompt }
      ];

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": cleanKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: activeModel,
          system: fullSystemPrompt,
          messages: apiMessages,
          max_tokens: 2000,
        }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        return NextResponse.json({ error: errJson.error?.message || "Anthropic API request failed" }, { status: 400 });
      }

      const data = await res.json();
      const responseText = data.content?.[0]?.text || "";

      // Parse JSON tool call if generated
      const toolCallMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/(\{\s*"tool_call"[\s\S]*?\})/);
      if (toolCallMatch) {
        try {
          const parsed = JSON.parse(toolCallMatch[1] || toolCallMatch[0]);
          if (parsed.tool_call) {
            return NextResponse.json({
              text: responseText.replace(/```json[\s\S]*?```/, "").trim(),
              toolCalls: [{
                id: `call_${Date.now()}`,
                name: parsed.tool_call.name,
                arguments: parsed.tool_call.arguments || {},
              }],
            });
          }
        } catch (e) {
          // Plain text fallback
        }
      }

      return NextResponse.json({ text: responseText });
    }

    return NextResponse.json({ error: `Unsupported provider: ${provider}` }, { status: 400 });
  } catch (error) {
    console.error("Agent step route error:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
