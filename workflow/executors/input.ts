import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

export async function executeInput(
  node: Node,
  runtime: WorkflowRuntime
) {
  const variable = String(node.data?.variable ?? "").trim();
  if (!variable) {
    console.warn("Input node has no variable name configured.");
    return;
  }

  const defaultValue = String(node.data?.defaultValue ?? "");
  const placeholder = String(node.data?.placeholder ?? `Enter value for variable "${variable}":`);

  // Check if variable is already set (e.g. from pre-run inputs)
  if (runtime.variables[variable] !== undefined && runtime.variables[variable] !== "") {
    return;
  }

  // Fallback to default value if provided
  if (defaultValue !== "") {
    runtime.variables[variable] = defaultValue;
    return;
  }

  // Prompt the user in the client if we're in the browser
  if (typeof window !== "undefined") {
    const userInput = window.prompt(placeholder, defaultValue);
    if (userInput !== null) {
      runtime.variables[variable] = userInput;
      return;
    }
  }

  // If all else fails, set it to empty string
  runtime.variables[variable] = "";
}
