import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

function resolveTemplate(template: string, variables: Record<string, any>): string {
  if (typeof template !== 'string') return '';
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    return val !== undefined ? String(val) : '';
  });
}

export async function executeTool(
  node: Node,
  runtime: WorkflowRuntime
) {
  const toolName = String(node.data?.tool ?? "web_search").trim();
  const argumentsRaw = String(node.data?.arguments ?? "");
  const outputVariable = String(node.data?.outputVariable ?? "tool_result").trim();

  // Substitute variables in arguments
  const resolvedArgument = resolveTemplate(argumentsRaw, runtime.variables);

  runtime.logs.push(`[Tool] Running "${toolName}" with arguments: "${resolvedArgument}"...`);

  try {
    const response = await fetch("/api/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action: "tool",
        tool: toolName,
        argument: resolvedArgument,
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
    runtime.logs.push(`[Tool] Success! Saved output to "${outputVariable}".`);
  } catch (error) {
    const errMsg = `[Tool Error] ${(error as Error).message}`;
    runtime.logs.push(errMsg);
    runtime.variables[outputVariable] = errMsg;
  }
}
