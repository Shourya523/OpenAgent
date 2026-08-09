"use client";

import React, { useState } from "react";
import { AgentConfig } from "./AgentBuilderForm";
import { TestCase } from "./TestCasesManager";
import { Award, CheckCircle2, Download, ShieldCheck, Sparkles, User, GraduationCap, FileText, X } from "lucide-react";

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AgentConfig;
  testCases: TestCase[];
}

export default function SubmissionModal({
  isOpen,
  onClose,
  config,
  testCases,
}: SubmissionModalProps) {
  const [studentName, setStudentName] = useState("");
  const [college, setCollege] = useState("");
  const [problemStatement, setProblemStatement] = useState(config.goal || "");
  const [whyUseful, setWhyUseful] = useState("");

  const [submittedData, setSubmittedData] = useState<any | null>(null);

  if (!isOpen) return null;

  // Calculate 100-point Rubric Score
  const computeScore = () => {
    const hasProblem = problemStatement.trim().length > 10 ? 20 : 10;
    const toolScore = Math.min(20, config.selectedToolIds.length * 7);
    const passCount = testCases.filter((tc) => tc.status === "passed").length;
    const testScore = testCases.length > 0 ? Math.min(15, Math.round((passCount / testCases.length) * 15)) : 5;
    const designScore = config.systemInstruction.length > 50 ? 15 : 10;
    const taskCompletionScore = 20;
    const creativityScore = whyUseful.trim().length > 20 ? 10 : 5;

    const total = hasProblem + toolScore + testScore + designScore + taskCompletionScore + creativityScore;

    return {
      total,
      breakdown: {
        problemDefinition: hasProblem,
        toolUsage: toolScore,
        taskCompletion: taskCompletionScore,
        testCases: testScore,
        agentDesign: designScore,
        creativity: creativityScore,
      },
    };
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !college.trim()) return;

    const uniqueAgentId = `GDG-AGENT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const score = computeScore();

    // Clean submission object - ABSOLUTELY NO API KEYS!
    const submission = {
      agentId: uniqueAgentId,
      submittedAt: new Date().toISOString(),
      studentName: studentName.trim(),
      college: college.trim(),
      agentName: config.name || "Custom Agent",
      problemStatement: problemStatement.trim(),
      systemInstructions: config.systemInstruction,
      selectedTools: config.selectedToolIds,
      testCasesCount: testCases.length,
      testPassCount: testCases.filter((tc) => tc.status === "passed").length,
      whyUseful: whyUseful.trim(),
      score,
    };

    setSubmittedData(submission);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl relative text-zinc-100 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                Workshop Agent Submission
              </h2>
              <p className="text-xs text-zinc-400">Submit your completed agent for automatic GDG grading & certificate.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 p-1.5"><X className="w-4 h-4" /></button>
        </div>

        {!submittedData ? (
          <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Student Full Name
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  College / University
                </label>
                <input
                  type="text"
                  required
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  placeholder="e.g. JIIT Noida 128"
                  className="bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Problem Statement
              </label>
              <textarea
                rows={2}
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                placeholder="What specific problem does your agent solve for students?"
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                Why is this Agent Useful?
              </label>
              <textarea
                rows={2}
                value={whyUseful}
                onChange={(e) => setWhyUseful(e.target.value)}
                placeholder="Explain why the selected tools are necessary and how the agent delivers value."
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Submission Security Notice */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-3 text-[11px] text-zinc-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Security Guarantee: Your BYO API keys are automatically excluded from submission payloads.</span>
            </div>

            <div className="flex justify-end gap-3 border-t border-zinc-800 pt-4">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs text-zinc-400 hover:text-white">
                Cancel
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-2 cursor-pointer"
              >
                Submit & Score Agent <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        ) : (
          /* Submission Results & GDG Certificate View */
          <div className="flex flex-col gap-6">
            
            {/* GDG Certificate Header */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/60 via-zinc-900 to-indigo-950/60 border border-blue-800/50 flex flex-col items-center justify-center text-center gap-3 relative">
              <div className="px-3 py-1 rounded-full bg-blue-900/40 border border-blue-700/50 text-[10px] font-bold text-blue-300 uppercase tracking-widest">
                GDG Student Workshop Certificate
              </div>
              <h3 className="text-2xl font-black text-white">Agentic AI Workshop Completion</h3>
              <p className="text-xs text-zinc-300">
                This certifies that <strong className="text-white">{submittedData.studentName}</strong> ({submittedData.college}) successfully built, tested, and evaluated agent <strong className="text-cyan-300">{submittedData.agentName}</strong>.
              </p>
              
              <div className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400 font-mono mt-1">
                Score: {submittedData.score.total} / 100
              </div>
              <span className="text-[10px] font-mono text-zinc-500">Agent ID: {submittedData.agentId}</span>
            </div>

            {/* Score Rubric Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">Problem Definition</span>
                <span className="font-bold text-emerald-400">{submittedData.score.breakdown.problemDefinition} / 20</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">Tool Usage</span>
                <span className="font-bold text-emerald-400">{submittedData.score.breakdown.toolUsage} / 20</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">Task Completion</span>
                <span className="font-bold text-emerald-400">{submittedData.score.breakdown.taskCompletion} / 20</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">Test Cases</span>
                <span className="font-bold text-emerald-400">{submittedData.score.breakdown.testCases} / 15</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">Agent Design</span>
                <span className="font-bold text-emerald-400">{submittedData.score.breakdown.agentDesign} / 15</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col gap-0.5">
                <span className="text-[10px] text-zinc-500 font-mono">Creativity</span>
                <span className="font-bold text-emerald-400">{submittedData.score.breakdown.creativity} / 10</span>
              </div>
            </div>

            {/* Export JSON Button */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  const blob = new Blob([JSON.stringify(submittedData, null, 2)], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `${submittedData.agentId}_submission.json`;
                  a.click();
                }}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4" /> Download Certificate Submission
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
