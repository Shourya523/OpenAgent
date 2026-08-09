"use client";

import React, { useState } from "react";
import { Play, Sparkles, Globe, Link, FilePlus, CheckCircle2, ArrowRight, RotateCcw } from "lucide-react";

interface DemoAgentViewProps {
  onStartOwnAgent: () => void;
}

export default function DemoAgentView({ onStartOwnAgent }: DemoAgentViewProps) {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const demoSteps = [
    {
      id: 1,
      title: "User Prompt Received",
      icon: Sparkles,
      iconColor: "text-blue-400",
      bgClass: "bg-blue-950/20 border-blue-800/40",
      content: '"Research quantum computing breakthroughs and create a short report."',
    },
    {
      id: 2,
      title: "Tool Call: search_web",
      icon: Globe,
      iconColor: "text-cyan-400",
      bgClass: "bg-cyan-950/20 border-cyan-800/40",
      content: 'Query: "quantum computing major breakthroughs 2026"',
      output: 'Results: [1] "Fault-tolerant Qubits by Quantum Lab", [2] "Room Temperature Superconductors Update"',
    },
    {
      id: 3,
      title: "Tool Call: read_url",
      icon: Link,
      iconColor: "text-purple-400",
      bgClass: "bg-purple-950/20 border-purple-800/40",
      content: 'URL: "https://quantum-research.org/2026-breakthroughs"',
      output: 'Extracted Content: Detailed paper summary on 10,000 logical qubit stability...',
    },
    {
      id: 4,
      title: "Tool Call: create_document",
      icon: FilePlus,
      iconColor: "text-emerald-400",
      bgClass: "bg-emerald-950/20 border-emerald-800/40",
      content: 'Title: "Quantum_Computing_Report_2026.md"',
      output: 'Document created with structured headers & citations.',
    },
    {
      id: 5,
      title: "Final Response Delivered",
      icon: CheckCircle2,
      iconColor: "text-amber-400",
      bgClass: "bg-amber-950/20 border-amber-800/40",
      content: "Here is your quantum computing summary report along with the saved document preview!",
    },
  ];

  const handleSimulate = () => {
    setIsSimulating(true);
    setActiveStep(1);

    let step = 1;
    const interval = setInterval(() => {
      step++;
      if (step <= demoSteps.length) {
        setActiveStep(step);
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  const handleReset = () => {
    setActiveStep(0);
    setIsSimulating(false);
  };

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-950/40 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Interactive Demo Agent — "Research Assistant"
            </h2>
            <p className="text-xs text-zinc-400">
              See how an autonomous agent inspects instructions, calls tools, and crafts answers.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeStep === 0 ? (
            <button
              onClick={handleSimulate}
              className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" /> Run Interactive Demo
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-semibold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo
            </button>
          )}

          <button
            onClick={onStartOwnAgent}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            Build Your Own Agent <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Execution Flow Diagram */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3 border border-zinc-900/60 rounded-2xl bg-zinc-950/60 p-4 font-mono text-xs select-none">
        <span className="px-2.5 py-1 rounded-lg bg-zinc-900 text-zinc-300 border border-zinc-800">User Goal</span>
        <span className="text-zinc-600">→</span>
        <span className={`px-2.5 py-1 rounded-lg border transition-all ${activeStep >= 2 ? "bg-cyan-950 text-cyan-300 border-cyan-800" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}>Web Search</span>
        <span className="text-zinc-600">→</span>
        <span className={`px-2.5 py-1 rounded-lg border transition-all ${activeStep >= 3 ? "bg-purple-950 text-purple-300 border-purple-800" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}>URL Reader</span>
        <span className="text-zinc-600">→</span>
        <span className={`px-2.5 py-1 rounded-lg border transition-all ${activeStep >= 4 ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}>Doc Generator</span>
        <span className="text-zinc-600">→</span>
        <span className={`px-2.5 py-1 rounded-lg border transition-all ${activeStep >= 5 ? "bg-amber-950 text-amber-300 border-amber-800" : "bg-zinc-900 text-zinc-500 border-zinc-800"}`}>Final Report</span>
      </div>

      {/* Step Execution Timeline Stream */}
      <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1">
        {demoSteps.map((step) => {
          const StepIcon = step.icon;
          const isCurrent = activeStep === step.id;
          const isPassed = activeStep > step.id;
          const isPending = activeStep < step.id;

          return (
            <div
              key={step.id}
              className={`p-4 rounded-2xl border transition-all duration-300 flex items-start gap-3.5 ${
                isCurrent
                  ? `${step.bgClass} shadow-lg scale-[1.01]`
                  : isPassed
                  ? "bg-zinc-900/40 border-zinc-800/80 opacity-90"
                  : "bg-zinc-900/10 border-zinc-900 opacity-40"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border ${
                  isCurrent
                    ? "bg-zinc-950 border-current"
                    : isPassed
                    ? "bg-emerald-950/40 border-emerald-800 text-emerald-400"
                    : "bg-zinc-900 border-zinc-800 text-zinc-600"
                } ${step.iconColor}`}
              >
                <StepIcon className="w-4 h-4" />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white flex items-center gap-2">
                    Step {step.id}: {step.title}
                  </span>
                  {isCurrent && isSimulating && (
                    <span className="text-[10px] text-cyan-400 font-mono animate-pulse">Executing...</span>
                  )}
                  {isPassed && (
                    <span className="text-[10px] text-emerald-400 font-mono font-semibold flex items-center gap-1">Done <CheckCircle2 className="w-3 h-3 text-emerald-400" /></span>
                  )}
                </div>

                <p className="text-xs text-zinc-300 font-mono">{step.content}</p>

                {step.output && (isCurrent || isPassed) && (
                  <div className="mt-1 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11px] text-zinc-300 font-mono">
                    <span className="text-zinc-500 font-semibold uppercase text-[9px] block mb-0.5">Tool Output</span>
                    {step.output}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
