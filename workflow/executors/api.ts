import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

function resolveTemplate(template: string, variables: Record<string, any>): string {
  if (typeof template !== 'string') return '';
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    return val !== undefined ? String(val) : '';
  });
}

export async function executeApi(
  node: Node,
  runtime: WorkflowRuntime
) {
  const method = String(node.data?.method ?? "GET").trim().toUpperCase();
  const urlRaw = String(node.data?.url ?? "");
  const headersRaw = String(node.data?.headers ?? "{}");
  const payloadRaw = String(node.data?.payload ?? "");
  const outputVariable = String(node.data?.outputVariable ?? "api_result").trim();

  // Substitute variables in URL, Headers, and Payload
  const resolvedUrl = resolveTemplate(urlRaw, runtime.variables);
  const resolvedHeadersStr = resolveTemplate(headersRaw, runtime.variables);
  const resolvedPayloadStr = resolveTemplate(payloadRaw, runtime.variables);

  runtime.logs.push(`[API] Triggering HTTP ${method} to "${resolvedUrl}"...`);

  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "api_call",
        url: resolvedUrl,
        method,
        headers: resolvedHeadersStr,
        payload: resolvedPayloadStr,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }

    runtime.variables[outputVariable] = data.result || "";
    runtime.logs.push(`[API] Success! Saved response to "${outputVariable}".`);
  } catch (error) {
    const errMsg = `[API Error] ${(error as Error).message}`;
    runtime.logs.push(errMsg);
    runtime.variables[outputVariable] = errMsg;
  }
}
