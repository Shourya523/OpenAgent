import { Node } from "@xyflow/react";
import { WorkflowRuntime } from "../runtime";

const STORAGE_PREFIX = "openagent_memory_";

export async function executeMemory(
  node: Node,
  runtime: WorkflowRuntime
) {
  const operation = String(node.data?.operation ?? "load").toLowerCase().trim();
  const variable = String(node.data?.variable ?? "").trim();

  if (!variable) {
    console.warn("Memory node has no variable name configured.");
    return;
  }

  if (typeof window === "undefined") {
    return; // No-op on server
  }

  const storageKey = STORAGE_PREFIX + variable;

  if (operation === "save") {
    const valToSave = runtime.variables[variable];
    if (valToSave !== undefined) {
      window.localStorage.setItem(storageKey, String(valToSave));
      console.log(`Saved memory: ${variable} = ${valToSave}`);
    }
  } else if (operation === "load") {
    const savedVal = window.localStorage.getItem(storageKey);
    runtime.variables[variable] = savedVal ?? "";
    console.log(`Loaded memory: ${variable} = ${runtime.variables[variable]}`);
  } else if (operation === "clear") {
    window.localStorage.removeItem(storageKey);
    console.log(`Cleared memory for: ${variable}`);
  }
}
