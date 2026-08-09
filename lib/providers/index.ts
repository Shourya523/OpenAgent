import { LLMProviderType, AgentRunStepInput, AgentRunStepResult, PROVIDERS_CONFIG } from "./types";

/**
 * Tests connection to selected provider with BYO API Key
 */
export async function testProviderConnection(
  provider: LLMProviderType,
  apiKey: string,
  model?: string
): Promise<{ success: boolean; message: string }> {
  if (!apiKey || !apiKey.trim()) {
    return { success: false, message: "API key cannot be empty." };
  }

  const selectedModel = model || PROVIDERS_CONFIG[provider]?.models[0]?.id;

  try {
    const res = await fetch("/api/agent/test-connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, apiKey: apiKey.trim(), model: selectedModel }),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      return { success: false, message: data.error || "Connection test failed." };
    }

    return { success: true, message: `Connected successfully to ${PROVIDERS_CONFIG[provider].name} (${selectedModel})!` };
  } catch (err) {
    return { success: false, message: `Network error testing ${provider}: ${(err as Error).message}` };
  }
}

/**
 * Executes a single agent turn/step using BYO API Key
 */
export async function runAgentTurn(input: AgentRunStepInput): Promise<AgentRunStepResult> {
  try {
    const res = await fetch("/api/agent/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    const data = await res.json();
    if (!res.ok || data.error) {
      return { error: data.error || "Failed to execute agent step." };
    }

    return {
      text: data.text,
      toolCalls: data.toolCalls,
      finishReason: data.finishReason,
    };
  } catch (err) {
    return { error: `Client-side error calling agent engine: ${(err as Error).message}` };
  }
}
