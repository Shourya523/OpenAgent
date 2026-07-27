import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

export async function executeOutput(
  node: Node,
  runtime: WorkflowRuntime
) {
  const variable = String(node.data?.variable ?? "answer").trim();
  const format = String(node.data?.format ?? "text").toLowerCase().trim();

  const outputValue = runtime.variables[variable];
  
  // Save formatted output to a special key in runtime
  runtime.variables["final_output"] = outputValue !== undefined ? outputValue : `(Variable "${variable}" is undefined)`;
  runtime.variables["final_output_format"] = format;

  console.log(`[Output Node] ${variable} (${format}):`, outputValue);
}