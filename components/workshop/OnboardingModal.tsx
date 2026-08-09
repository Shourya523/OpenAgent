"use client";

import React, { useState } from "react";
import { Sparkles, Cpu, Layers, Play, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartBuilding: () => void;
  onTryDemo: () => void;
}

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: "Welcome to GDG Agent Workshop",
    subtitle: "Hands-on platform for building autonomous AI agents directly in your browser.",
    icon: Sparkles,
    content: (
      <div className="flex flex-col gap-4 text-xs text-zinc-300 leading-relaxed">
        <p>
          Welcome! In this Google Developer Groups (GDG) student workshop, you will learn how to design, assemble, test, and evaluate custom AI Agents without installing any local developer tools.
        </p>
        <div className="bg-blue-950/20 border border-blue-900/40 p-3.5 rounded-2xl flex flex-col gap-1.5 text-blue-200">
          <span className="font-bold text-xs">What You Will Build:</span>
          <p className="text-[11.5px] text-blue-300/90">
            A fully functioning AI agent that takes user requests, decides which tools to call (Web Search, File Reader, Math Calculator, Document Generator, Memory, etc.), executes actions, and returns results!
          </p>
        </div>
      </div>
    ),
  },
  {
    step: 2,
    title: "What is an Agentic AI System?",
    subtitle: "Understanding how agents differ from traditional chatbots.",
    icon: Cpu,
    content: (
      <div className="flex flex-col gap-3 text-xs text-zinc-300 leading-relaxed">
        <p>
          A regular chatbot can only generate static text responses. An <strong className="text-white">Agentic AI System</strong> can perceive user goals, reason step-by-step, choose tools dynamically, process tool outputs, and refine its final answer!
        </p>
        
        {/* Visual Lego Architecture Diagram */}
        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center font-mono text-[11px]">
          <div className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 font-bold">
            Student's Goal
          </div>
          <span className="text-zinc-500">↓</span>
          <div className="px-3 py-1 bg-blue-950 border border-blue-800 rounded-lg text-blue-300 font-bold">
            System Instructions
          </div>
          <span className="text-zinc-500">↓</span>
          <div className="px-3 py-1 bg-purple-950 border border-purple-800 rounded-lg text-purple-300 font-bold">
            Selected Tools (Web, Math, Files...)
          </div>
          <span className="text-zinc-500">↓</span>
          <div className="px-3 py-1 bg-emerald-950 border border-emerald-800 rounded-lg text-emerald-300 font-bold">
            Tool Calls & Results Loop
          </div>
          <span className="text-zinc-500">↓</span>
          <div className="px-3 py-1 bg-indigo-950 border border-indigo-800 rounded-lg text-indigo-300 font-bold">
            Final Answer
          </div>
        </div>
      </div>
    ),
  },
  {
    step: 3,
    title: "The Workshop Workflow",
    subtitle: "Build like assembling Lego blocks",
    icon: Layers,
    content: (
      <div className="flex flex-col gap-3 text-xs text-zinc-300">
        <p>Follow these quick steps during today's workshop:</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">1</span>
            <div><strong className="text-white block">Provide API Key</strong>BYO Gemini, OpenAI, Groq, or Anthropic key.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">2</span>
            <div><strong className="text-white block">Pick Tools</strong>Enable web search, calculator, file reader, etc.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">3</span>
            <div><strong className="text-white block">Test in Playground</strong>Watch live tool execution timeline.</div>
          </div>
          <div className="p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold flex items-center justify-center text-[10px] shrink-0">4</span>
            <div><strong className="text-white block">Submit Assignment</strong>Get auto-scored and receive GDG certificate.</div>
          </div>
        </div>
      </div>
    ),
  },
];

export default function OnboardingModal({
  isOpen,
  onClose,
  onStartBuilding,
  onTryDemo,
}: OnboardingModalProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  if (!isOpen) return null;

  const currentStep = ONBOARDING_STEPS[currentStepIdx];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (currentStepIdx < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIdx(currentStepIdx + 1);
    } else {
      onClose();
      onStartBuilding();
    }
  };

  const handleBack = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(currentStepIdx - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl relative text-zinc-100 flex flex-col gap-6">
        
        {/* Step Indicator */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-2">
            {ONBOARDING_STEPS.map((s, idx) => (
              <span
                key={s.step}
                className={`h-1.5 rounded-full transition-all ${
                  idx === currentStepIdx
                    ? "w-8 bg-blue-500"
                    : idx < currentStepIdx
                    ? "w-3 bg-zinc-600"
                    : "w-3 bg-zinc-800"
                }`}
              />
            ))}
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            Step {currentStepIdx + 1} of {ONBOARDING_STEPS.length}
          </span>
        </div>

        {/* Body Content */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950/40 border border-blue-800/40 flex items-center justify-center text-blue-400 shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">{currentStep.title}</h2>
              <p className="text-xs text-zinc-400">{currentStep.subtitle}</p>
            </div>
          </div>

          <div className="mt-2">{currentStep.content}</div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80">
          {currentStepIdx > 0 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-xl transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onTryDemo();
              }}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-3 py-2 rounded-xl border border-cyan-900/50 bg-cyan-950/20 transition-all flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" /> Try Demo Agent
            </button>
          )}

          <button
            onClick={handleNext}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center gap-1.5 cursor-pointer"
          >
            {currentStepIdx === ONBOARDING_STEPS.length - 1 ? (
              <>Start Agent Builder <Sparkles className="w-3.5 h-3.5" /></>
            ) : (
              <>Next Step <ArrowRight className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
