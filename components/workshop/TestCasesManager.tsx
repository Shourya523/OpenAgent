"use client";

import React, { useState } from "react";
import { AgentConfig } from "./AgentBuilderForm";
import { LLMProviderType } from "@/lib/providers/types";
import { runAgentTurn } from "@/lib/providers";
import { WORKSHOP_TOOLS } from "@/lib/tools/registry";
import {
  CheckCircle2,
  XCircle,
  Play,
  Plus,
  Trash2,
  ListChecks,
  Sparkles,
  Wrench,
  RotateCcw,
} from "lucide-react";

export interface TestCase {
  id: string;
  inputPrompt: string;
  expectedBehavior: string;
  requiredTool?: string;
  status?: "idle" | "passed" | "failed";
  actualResponse?: string;
  toolsUsed?: string[];
  reason?: string;
}

interface TestCasesManagerProps {
  config: AgentConfig;
  provider: LLMProviderType;
  apiKey: string;
  model: string;
  onOpenApiConfig: () => void;
}

const DEFAULT_TEST_CASES: TestCase[] = [
  {
    id: "tc_1",
    inputPrompt: "I have 5 days to study these 3 chapters.",
    expectedBehavior: "Creates a realistic study plan and lists daily targets.",
    requiredTool: "create_document",
  },
  {
    id: "tc_2",
    inputPrompt: "Search the web for quantum computing breakthroughs in 2026.",
    expectedBehavior: "Calls search_web tool and provides factual summary.",
    requiredTool: "search_web",
  },
  {
    id: "tc_3",
    inputPrompt: "Calculate (450 * 12) / 4 and show your answer.",
    expectedBehavior: "Evaluates arithmetic expression to return 1350.",
    requiredTool: "calculate",
  },
];

export default function TestCasesManager({
  config,
  provider,
  apiKey,
  model,
  onOpenApiConfig,
}: TestCasesManagerProps) {
  const [testCases, setTestCases] = useState<TestCase[]>(DEFAULT_TEST_CASES);
  const [isRunning, setIsRunning] = useState(false);
  const [newInput, setNewInput] = useState("");
  const [newExpected, setNewExpected] = useState("");

  const handleAddTestCase = () => {
    if (!newInput.trim() || !newExpected.trim()) return;
    const tc: TestCase = {
      id: `tc_${Date.now()}`,
      inputPrompt: newInput.trim(),
      expectedBehavior: newExpected.trim(),
      status: "idle",
    };
    setTestCases((prev) => [...prev, tc]);
    setNewInput("");
    setNewExpected("");
  };

  const handleDeleteTestCase = (id: string) => {
    setTestCases((prev) => prev.filter((tc) => tc.id !== id));
  };

  const handleRunAllTests = async () => {
    if (!apiKey) {
      onOpenApiConfig();
      return;
    }

    setIsRunning(true);

    const enabledToolsDef = config.selectedToolIds
      .map((id) => WORKSHOP_TOOLS[id])
      .filter(Boolean)
      .map((t) => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema,
      }));

    const updated = [...testCases];

    for (let i = 0; i < updated.length; i++) {
      const tc = updated[i];
      const toolsCalled: string[] = [];

      try {
        const stepRes = await runAgentTurn({
          provider,
          apiKey,
          model,
          systemInstruction: config.systemInstruction || "You are a helpful assistant.",
          userPrompt: tc.inputPrompt,
          availableTools: enabledToolsDef,
        });

        if (stepRes.toolCalls && stepRes.toolCalls.length > 0) {
          stepRes.toolCalls.forEach((call) => toolsCalled.push(call.name));
        }

        const respText = stepRes.text || "";
        const lowerResp = respText.toLowerCase();

        // Evaluation Logic
        let passed = false;
        let reason = "Evaluation complete.";

        if (tc.requiredTool) {
          if (toolsCalled.includes(tc.requiredTool)) {
            passed = true;
            reason = `Successfully invoked required tool: ${tc.requiredTool}`;
          } else {
            passed = false;
            reason = `Expected tool "${tc.requiredTool}" was not called.`;
          }
        } else {
          // General heuristic check
          passed = respText.length > 10;
          reason = "Agent returned valid completion response.";
        }

        updated[i] = {
          ...tc,
          status: passed ? "passed" : "failed",
          actualResponse: respText.substring(0, 200) + (respText.length > 200 ? "..." : ""),
          toolsUsed: toolsCalled,
          reason,
        };
      } catch (err) {
        updated[i] = {
          ...tc,
          status: "failed",
          actualResponse: `Error: ${(err as Error).message}`,
          reason: "Execution error during evaluation.",
        };
      }

      setTestCases([...updated]);
    }

    setIsRunning(false);
  };

  const passedCount = testCases.filter((tc) => tc.status === "passed").length;
  const totalCount = testCases.length;

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
            <ListChecks className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              Agent Test Suite
            </h2>
            <p className="text-xs text-zinc-400">Run automated benchmark test cases against your agent.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {totalCount > 0 && (
            <div className="text-xs font-mono px-3 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
              Score: <strong className="text-emerald-400">{passedCount}/{totalCount} Passed</strong>
            </div>
          )}

          <button
            onClick={handleRunAllTests}
            disabled={isRunning || totalCount === 0}
            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
          >
            {isRunning ? <Sparkles className="w-3.5 h-3.5 text-white animate-spin" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            Run All Tests
          </button>
        </div>
      </div>

      {/* Add Test Case Form */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl flex flex-col gap-3">
        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-blue-400" /> Add New Test Case
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            type="text"
            value={newInput}
            onChange={(e) => setNewInput(e.target.value)}
            placeholder="Test Input Prompt e.g. Calculate compound interest..."
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={newExpected}
            onChange={(e) => setNewExpected(e.target.value)}
            placeholder="Expected Behavior e.g. Calls calculator tool and outputs 1500..."
            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAddTestCase}
            disabled={!newInput.trim() || !newExpected.trim()}
            className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 disabled:opacity-50 text-xs text-white px-4 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer"
          >
            Add Test Case
          </button>
        </div>
      </div>

      {/* Test Cases List */}
      <div className="flex flex-col gap-3">
        {testCases.map((tc, idx) => (
          <div
            key={tc.id}
            className={`p-4 rounded-2xl border transition-all flex flex-col gap-2 ${
              tc.status === "passed"
                ? "bg-emerald-950/20 border-emerald-800/50"
                : tc.status === "failed"
                ? "bg-red-950/20 border-red-800/50"
                : "bg-zinc-900/20 border-zinc-800/80"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-bold text-zinc-400 font-mono">TEST {idx + 1}</span>
                <span className="text-xs font-semibold text-white">"{tc.inputPrompt}"</span>
              </div>

              <div className="flex items-center gap-2">
                {tc.status === "passed" && (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Passed
                  </span>
                )}
                {tc.status === "failed" && (
                  <span className="text-xs text-red-400 font-bold flex items-center gap-1">
                    <XCircle className="w-4 h-4" /> Failed
                  </span>
                )}
                {(!tc.status || tc.status === "idle") && (
                  <span className="text-xs text-zinc-500 font-mono">Idle</span>
                )}

                <button
                  onClick={() => handleDeleteTestCase(tc.id)}
                  className="text-zinc-600 hover:text-red-400 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <p className="text-xs text-zinc-400">
              <strong className="text-zinc-300">Expected:</strong> {tc.expectedBehavior}
            </p>

            {tc.toolsUsed && tc.toolsUsed.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-cyan-300 font-mono">
                <Wrench className="w-3 h-3 text-cyan-400" /> Tools Called: {tc.toolsUsed.join(", ")}
              </div>
            )}

            {tc.actualResponse && (
              <div className="mt-1 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
                <span className="text-zinc-500 block text-[9px] uppercase">Agent Response & Reason</span>
                {tc.actualResponse}
                {tc.reason && <div className="text-zinc-400 mt-1 italic">— {tc.reason}</div>}
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
