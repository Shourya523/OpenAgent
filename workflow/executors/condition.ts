import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

function resolveTemplate(template: string, variables: Record<string, any>): string {
  if (typeof template !== 'string') return '';
  return template.replace(/\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    return val !== undefined ? String(val) : '';
  });
}

export async function executeCondition(
  node: Node,
  runtime: WorkflowRuntime
): Promise<boolean> {
  const leftRaw = String(node.data?.leftOperand ?? "");
  const operator = String(node.data?.operator ?? "==").trim();
  const rightRaw = String(node.data?.rightOperand ?? "");

  // Resolve template variables
  const left = resolveTemplate(leftRaw, runtime.variables).trim();
  const right = resolveTemplate(rightRaw, runtime.variables).trim();

  let result = false;

  switch (operator) {
    case "==":
    case "equals":
      result = left.toLowerCase() === right.toLowerCase();
      break;
    case "!=":
    case "not equals":
      result = left.toLowerCase() !== right.toLowerCase();
      break;
    case "contains":
    case "includes":
      result = left.toLowerCase().includes(right.toLowerCase());
      break;
    case ">":
      result = parseFloat(left) > parseFloat(right);
      break;
    case "<":
      result = parseFloat(left) < parseFloat(right);
      break;
    case ">=":
      result = parseFloat(left) >= parseFloat(right);
      break;
    case "<=":
      result = parseFloat(left) <= parseFloat(right);
      break;
    default:
      result = false;
      break;
  }

  console.log(`Condition node [${node.id}] evaluated: "${left}" ${operator} "${right}" -> ${result}`);
  runtime.variables[`${node.id}_result`] = result;
  return result;
}
