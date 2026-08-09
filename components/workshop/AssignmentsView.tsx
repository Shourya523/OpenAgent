"use client";

import React from "react";
import { BookOpen, Layers, Award, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

interface AssignmentsViewProps {
  onSelectAssignment: (level: number, title: string, requiredTools: string[]) => void;
  onSubmitAssignment: () => void;
}

export const WORKSHOP_ASSIGNMENTS = [
  {
    level: 1,
    title: "Level 1 — Tool Agent",
    badge: "Beginner",
    badgeColor: "bg-blue-950/40 text-blue-300 border-blue-800/40",
    description: "Build an agent that uses at least ONE tool to retrieve external information.",
    example: "Research agent that searches the web for topic facts and summarizes them.",
    requiredTools: ["web_search"],
  },
  {
    level: 2,
    title: "Level 2 — Multi-Tool Agent",
    badge: "Intermediate",
    badgeColor: "bg-purple-950/40 text-purple-300 border-purple-800/40",
    description: "Build an agent using at least TWO tools working together.",
    example: "Upload your syllabus, research extra resources on the web, and generate a structured study plan.",
    requiredTools: ["read_file", "search_web", "create_document"],
  },
  {
    level: 3,
    title: "Level 3 — Autonomous Agent",
    badge: "Advanced",
    badgeColor: "bg-emerald-950/40 text-emerald-300 border-emerald-800/40",
    description: "Build an agent that dynamically selects appropriate tools depending on user requests.",
    example: "Assistant that analyzes a document, searches extra info, performs math calculations, and emails a report.",
    requiredTools: ["read_file", "search_web", "calculate", "send_email", "create_document"],
  },
  {
    level: 4,
    title: "Free Build — 'Build Something Useful'",
    badge: "Capstone",
    badgeColor: "bg-amber-950/40 text-amber-300 border-amber-800/40",
    description: "Identify a real student problem statement and design a custom agent to solve it.",
    example: "Exam cram planner, internship application assistant, or lab report generator.",
    requiredTools: ["search_web", "create_document"],
  },
];

export default function AssignmentsView({
  onSelectAssignment,
  onSubmitAssignment,
}: AssignmentsViewProps) {
  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-2xl relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-950/40 border border-amber-800/50 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              GDG Workshop Curriculum & Assignments
            </h2>
            <p className="text-xs text-zinc-400">Complete challenges to test your agent and submit for your workshop score.</p>
          </div>
        </div>

        <button
          onClick={onSubmitAssignment}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Award className="w-4 h-4" /> Submit Finished Assignment
        </button>
      </div>

      {/* Assignment Track Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {WORKSHOP_ASSIGNMENTS.map((asgn) => (
          <div
            key={asgn.level}
            className="p-5 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all flex flex-col justify-between gap-4"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-base text-white">{asgn.title}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${asgn.badgeColor}`}>
                  {asgn.badge}
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">{asgn.description}</p>
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 text-[11.5px] text-zinc-400">
                <strong className="text-zinc-200 block mb-0.5">Example Challenge:</strong>
                {asgn.example}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <span className="text-[10px] font-mono text-zinc-500">
                Requires: {asgn.requiredTools.join(", ")}
              </span>
              <button
                onClick={() => onSelectAssignment(asgn.level, asgn.title, asgn.requiredTools)}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
              >
                Load Challenge <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
