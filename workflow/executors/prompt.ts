import { WorkflowRuntime } from "../runtime";
import { Node } from "@xyflow/react";

function resolveTemplate(template: string, variables: Record<string, any>): string {
  if (typeof template !== 'string') return '';
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    return val !== undefined ? String(val) : '';
  });
}

export async function executePrompt(
  node: Node,
  runtime: WorkflowRuntime
) {
  const promptTemplate = String(node.data?.prompt ?? "");
  const outputVariable = String(node.data?.outputVariable ?? "prompt").trim();

  // Resolve template placeholders with current runtime variables
  const resolvedPrompt = resolveTemplate(promptTemplate, runtime.variables);

  runtime.variables[outputVariable] = resolvedPrompt;
  console.log(`Prompt node [${node.id}] stored in "${outputVariable}":`, resolvedPrompt);
}