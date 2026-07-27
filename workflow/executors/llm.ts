import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

export async function executeLLM(
  node: Node,
  runtime: WorkflowRuntime
) {
  const model = String(node.data?.model ?? "gemini-3.1-flash-lite").trim();
  const systemPrompt = String(node.data?.systemPrompt ?? "").trim();
  const temperatureRaw = node.data?.temperature;
  const maxTokensRaw = node.data?.maxTokens;

  // Let the user configure which variable holds the input prompt (defaulting to "prompt")
  const inputVariable = String(node.data?.inputVariable ?? "prompt").trim();
  const outputVariable = String(node.data?.outputVariable ?? "answer").trim();

  const prompt = typeof runtime.variables[inputVariable] === "string"
    ? runtime.variables[inputVariable]
    : typeof runtime.variables.prompt === "string"
    ? runtime.variables.prompt
    : "";

  const temperature = temperatureRaw ? parseFloat(String(temperatureRaw)) : undefined;
  const maxTokens = maxTokensRaw ? parseInt(String(maxTokensRaw), 10) : undefined;

  runtime.logs.push(`[LLM] Calling model "${model}" with prompt from "${inputVariable}"...`);

  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "llm",
        model,
        prompt,
        systemPrompt: systemPrompt || undefined,
        temperature,
        maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    runtime.variables[outputVariable] = data.text || "";
    runtime.logs.push(`[LLM] Success! Generated ${data.text ? data.text.length : 0} characters.`);
  } catch (error) {
    const errMsg = `[LLM Error] ${(error as Error).message}`;
    runtime.logs.push(errMsg);
    runtime.variables[outputVariable] = errMsg;
  }
}