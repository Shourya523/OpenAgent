import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "./runtime";

import { executePrompt } from "./executors/prompt";
import { executeLLM } from "./executors/llm";
import { executeOutput } from "./executors/output";
import { executeInput } from "./executors/input";
import { executeMemory } from "./executors/memory";
import { executeTool } from "./executors/tool";
import { executeCondition } from "./executors/condition";
import { executeApi } from "./executors/api";

// Helper to determine the node's semantic config type
export const getNodeConfigType = (node: Node) => {
  const explicitType = typeof node.data?.nodeType === 'string' ? node.data.nodeType : undefined;
  if (explicitType) return explicitType;

  const label = String(node.data?.label ?? '').toLowerCase();
  if (label.includes('prompt')) return 'prompt';
  if (label.includes('llm')) return 'llm';
  if (label.includes('tool')) return 'tool';
  if (label.includes('memory')) return 'memory';
  if (label.includes('condition')) return 'condition';
  if (label.includes('input')) return 'input';
  if (label.includes('output')) return 'output';
  if (label.includes('api')) return 'api';

  return typeof node.type === 'string' ? node.type : 'default';
};

export async function executeNode(
  node: Node,
  runtime: WorkflowRuntime
) {
  const configType = getNodeConfigType(node);

  switch (configType) {
    case "input":
      await executeInput(node, runtime);
      break;

    case "prompt":
      await executePrompt(node, runtime);
      break;

    case "llm":
      await executeLLM(node, runtime);
      break;

    case "tool":
      await executeTool(node, runtime);
      break;

    case "memory":
      await executeMemory(node, runtime);
      break;

    case "condition":
      await executeCondition(node, runtime);
      break;

    case "output":
      await executeOutput(node, runtime);
      break;

    case "api":
      await executeApi(node, runtime);
      break;

    default:
      console.warn(`No executor found for node config type: "${configType}"`);
      break;
  }
}