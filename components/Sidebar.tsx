"use client"

import React, { useState } from "react"
import { useDnD } from "./DnDContext"
import {
  Play,
  Sparkles,
  Cpu,
  Database,
  GitFork,
  Download,
  Terminal,
  Search,
  Info,
  Link2,
  Globe,
  Link,
  FileText,
  Calculator,
  FilePlus,
  CheckSquare,
  Mail,
  Code,
  Image,
  Bot,
  Layers,
  HelpCircle,
  Share2,
  Award,
} from "lucide-react"

export interface PaletteNodeItem {
  type: string;
  nodeType?: string;
  label: string;
  category: "core" | "info" | "action" | "advanced";
  iconColor: string;
  hoverColor: string;
  indicatorBg: string;
  icon: any;
  desc: string;
  explanation: string;
}

const PALETTE_CATEGORIES = [
  { id: "core", title: "Core Nodes", desc: "Basic workflow building blocks" },
  { id: "info", title: "Information Tools", desc: "Search, read files, calculate data" },
  { id: "action", title: "Action Tools", desc: "Create tasks, email, generate docs" },
  { id: "advanced", title: "Advanced & Agent Nodes", desc: "Autonomous ReAct agents & memory" },
];

const NODE_TYPES: PaletteNodeItem[] = [
  // CORE
  {
    type: "input",
    nodeType: "input",
    label: "Input Node",
    category: "core",
    iconColor: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
    hoverColor: "hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-emerald-500",
    icon: Play,
    desc: "Workflow entry point for variable inputs.",
    explanation: "Input = user request or starting prompt passed into the workflow.",
  },
  {
    type: "default",
    nodeType: "prompt",
    label: "Prompt Node",
    category: "core",
    iconColor: "text-sky-400 bg-sky-950/20 border-sky-900/40",
    hoverColor: "hover:border-sky-500/40 hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-sky-500",
    icon: Terminal,
    desc: "Formats system & user prompt templates.",
    explanation: "Prompt = instructions telling the LLM how to format and answer.",
  },
  {
    type: "default",
    nodeType: "llm",
    label: "LLM Node",
    category: "core",
    iconColor: "text-purple-400 bg-purple-950/20 border-purple-900/40",
    hoverColor: "hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-purple-500",
    icon: Sparkles,
    desc: "Generates completions using Gemini/BYO key.",
    explanation: "LLM = reasoning engine that processes input and generates text.",
  },
  {
    type: "output",
    nodeType: "output",
    label: "Output Node",
    category: "core",
    iconColor: "text-indigo-400 bg-indigo-950/20 border-indigo-900/40",
    hoverColor: "hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-indigo-500",
    icon: Download,
    desc: "Delivers final output text or JSON payload.",
    explanation: "Output = final result shown to the user.",
  },

  // INFO TOOLS
  {
    type: "default",
    nodeType: "tool",
    label: "Web Search",
    category: "info",
    iconColor: "text-cyan-400 bg-cyan-950/20 border-cyan-900/40",
    hoverColor: "hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-cyan-500",
    icon: Globe,
    desc: "Searches live internet for up-to-date facts.",
    explanation: "Tool = capability enabling AI to fetch fresh online data.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "URL Reader",
    category: "info",
    iconColor: "text-purple-400 bg-purple-950/20 border-purple-900/40",
    hoverColor: "hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-purple-500",
    icon: Link,
    desc: "Scrapes readable text from target web pages.",
    explanation: "Tool = extracts full web page content for AI analysis.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "File Reader",
    category: "info",
    iconColor: "text-amber-400 bg-amber-950/20 border-amber-900/40",
    hoverColor: "hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-amber-500",
    icon: FileText,
    desc: "Parses PDF, CSV, JSON, TXT, DOCX text.",
    explanation: "Tool = reads uploaded student files into prompt context.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Vector DB Search (Qdrant)",
    category: "info",
    iconColor: "text-purple-400 bg-purple-950/20 border-purple-900/40",
    hoverColor: "hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-purple-500",
    icon: Database,
    desc: "Qdrant Vector DB semantic search for documentation RAG.",
    explanation: "Vector DB = retrieves relevant document chunks based on embedding similarity.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Calculator",
    category: "info",
    iconColor: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
    hoverColor: "hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-emerald-500",
    icon: Calculator,
    desc: "Evaluates exact math calculations safely.",
    explanation: "Tool = guarantees accurate math evaluation.",
  },

  // ACTION TOOLS
  {
    type: "default",
    nodeType: "tool",
    label: "Task Manager",
    category: "action",
    iconColor: "text-blue-400 bg-blue-950/20 border-blue-900/40",
    hoverColor: "hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-blue-500",
    icon: CheckSquare,
    desc: "Creates & completes study plan tasks.",
    explanation: "Action = tracks student todo list items.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Mock Email",
    category: "action",
    iconColor: "text-purple-400 bg-purple-950/20 border-purple-900/40",
    hoverColor: "hover:border-purple-500/40 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-purple-500",
    icon: Mail,
    desc: "Prepares interactive draft email cards.",
    explanation: "Action = triggers interactive email workflow.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "HTML Webpage Generator",
    category: "action",
    iconColor: "text-cyan-400 bg-cyan-950/20 border-cyan-900/40",
    hoverColor: "hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-cyan-500",
    icon: Code,
    desc: "Generates responsive HTML/CSS/JS webpages.",
    explanation: "Action = generates interactive web applications & landing pages.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Doc Generator",
    category: "action",
    iconColor: "text-emerald-400 bg-emerald-950/20 border-emerald-900/40",
    hoverColor: "hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-emerald-500",
    icon: FilePlus,
    desc: "Creates Markdown/PDF report files.",
    explanation: "Action = generates structured study guides.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Quiz Prep Generator",
    category: "action",
    iconColor: "text-amber-400 bg-amber-950/20 border-amber-900/40",
    hoverColor: "hover:border-amber-500/40 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-amber-500",
    icon: HelpCircle,
    desc: "Generates multiple-choice practice quizzes.",
    explanation: "Action = generates interactive study revision quizzes.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Code & Bug Explainer",
    category: "info",
    iconColor: "text-blue-400 bg-blue-950/20 border-blue-900/40",
    hoverColor: "hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-blue-500",
    icon: Code,
    desc: "Explains CS code line-by-line for beginners.",
    explanation: "Tool = breaks down Java/C++/Python code logic.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "LinkedIn Post Maker",
    category: "action",
    iconColor: "text-indigo-400 bg-indigo-950/20 border-indigo-900/40",
    hoverColor: "hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-indigo-500",
    icon: Share2,
    desc: "Drafts engaging LinkedIn project posts.",
    explanation: "Action = prepares career portfolio social posts.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Flashcards Creator",
    category: "action",
    iconColor: "text-rose-400 bg-rose-950/20 border-rose-900/40",
    hoverColor: "hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-rose-500",
    icon: Layers,
    desc: "Creates exam review flashcard decks.",
    explanation: "Action = generates Q&A revision flashcards.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Junior Resume Reviewer",
    category: "action",
    iconColor: "text-teal-400 bg-teal-950/20 border-teal-900/40",
    hoverColor: "hover:border-teal-500/40 hover:shadow-[0_0_15px_rgba(20,184,166,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-teal-500",
    icon: Award,
    desc: "Reviews student resumes & skill gaps.",
    explanation: "Action = provides junior career feedback.",
  },

  // ADVANCED & AGENT
  {
    type: "default",
    nodeType: "agent",
    label: "Autonomous Agent",
    category: "advanced",
    iconColor: "text-amber-400 bg-amber-950/25 border-amber-800/50",
    hoverColor: "hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:bg-zinc-900/40",
    indicatorBg: "bg-amber-500",
    icon: Bot,
    desc: "ReAct LLM that dynamically picks tools.",
    explanation: "Agent = LLM that decides WHICH tool to call based on goal.",
  },
  {
    type: "default",
    nodeType: "memory",
    label: "Memory Store",
    category: "advanced",
    iconColor: "text-teal-400 bg-teal-950/20 border-teal-900/40",
    hoverColor: "hover:border-teal-500/40 hover:shadow-[0_0_15px_rgba(13,148,136,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-teal-500",
    icon: Database,
    desc: "Saves & retrieves persistent context.",
    explanation: "Memory = retains variable state across steps.",
  },
  {
    type: "default",
    nodeType: "condition",
    label: "Condition Node",
    category: "advanced",
    iconColor: "text-rose-400 bg-rose-950/20 border-rose-900/40",
    hoverColor: "hover:border-rose-500/40 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-rose-500",
    icon: GitFork,
    desc: "Branches logic execution based on rules.",
    explanation: "Logic = routes path if condition is true/false.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Code Runner",
    category: "advanced",
    iconColor: "text-cyan-400 bg-cyan-950/20 border-cyan-900/40",
    hoverColor: "hover:border-cyan-500/40 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-cyan-500",
    icon: Code,
    desc: "Runs Python code snippets in sandbox.",
    explanation: "Advanced = sandboxed Python execution.",
  },
  {
    type: "default",
    nodeType: "tool",
    label: "Image Generator",
    category: "advanced",
    iconColor: "text-indigo-400 bg-indigo-950/20 border-indigo-900/40",
    hoverColor: "hover:border-indigo-500/40 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:bg-zinc-900/30",
    indicatorBg: "bg-indigo-500",
    icon: Image,
    desc: "Generates custom visual graphics.",
    explanation: "Advanced = renders visual AI images.",
  },
];

export default function Sidebar() {
  const [_, setDndItem] = useDnD();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, item: PaletteNodeItem) => {
    setDndItem({ type: item.type, label: item.label, nodeType: item.nodeType });
    event.dataTransfer.setData("application/reactflow/type", item.type);
    event.dataTransfer.setData("application/reactflow/label", item.label);
    event.dataTransfer.effectAllowed = "move";
  };

  const filteredNodes = NODE_TYPES.filter((n) => {
    const matchesSearch = n.label.toLowerCase().includes(search.toLowerCase()) || n.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "all" || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <aside className="absolute top-4 left-4 bottom-4 z-20 w-64 p-4 bg-zinc-950/90 backdrop-blur-md border border-zinc-900/80 rounded-2xl text-zinc-150 flex flex-col gap-3 select-none shadow-2xl overflow-y-auto text-left">
      
      {/* Sidebar Header */}
      <div className="flex flex-col gap-1 border-b border-zinc-900 pb-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" /> Node Palette
          </span>
          <span className="text-[9px] font-mono text-zinc-500">Drag to Canvas</span>
        </div>
        <p className="text-[10px] text-zinc-400 leading-normal">
          Assemble your AI agent with modular capabilities.
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-500" />
        <input
          type="text"
          placeholder="Search nodes & tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px]">
        <button
          onClick={() => setActiveCategory("all")}
          className={`px-2.5 py-1 rounded-lg border transition-colors shrink-0 ${
            activeCategory === "all" ? "bg-cyan-950 border-cyan-700 text-cyan-300 font-bold" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          All
        </button>
        {PALETTE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2 py-1 rounded-lg border transition-colors shrink-0 ${
              activeCategory === cat.id ? "bg-cyan-950 border-cyan-700 text-cyan-300 font-bold" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {cat.title.split(" ")[0]} {cat.title.split(" ")[1]}
          </button>
        ))}
      </div>

      {/* Node Items List */}
      <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
        {filteredNodes.length === 0 ? (
          <div className="text-zinc-500 text-center py-6 text-xs italic">No matching nodes found.</div>
        ) : (
          filteredNodes.map((item) => {
            const IconComp = item.icon;
            return (
              <div
                key={item.label}
                className={`group border border-zinc-900 bg-zinc-900/20 rounded-xl p-3 cursor-grab active:cursor-grabbing transition-all duration-300 flex flex-col gap-1.5 relative overflow-hidden shrink-0 ${item.hoverColor}`}
                onDragStart={(e) => onDragStart(e, item)}
                draggable
              >
                {/* Indicator accent strip */}
                <div className={`absolute top-0 bottom-0 left-0 w-[3px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${item.indicatorBg}`} />

                <div className="flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 ${item.iconColor}`}>
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{item.label}</span>
                  </div>

                  <div className="group/tooltip relative">
                    <HelpCircle className="w-3.5 h-3.5 text-zinc-600 hover:text-cyan-400 cursor-help" />
                    <div className="absolute right-0 top-6 hidden group-hover/tooltip:block w-44 p-2 bg-zinc-900 border border-zinc-700 rounded-xl text-[10px] text-zinc-300 shadow-xl z-50 pointer-events-none">
                      <strong className="text-cyan-300 block mb-0.5">Concept:</strong>
                      {item.explanation}
                    </div>
                  </div>
                </div>

                <p className="text-[10px] text-zinc-400 leading-snug group-hover:text-zinc-300 transition-colors z-10">
                  {item.desc}
                </p>
              </div>
            );
          })
        )}
      </div>

      {/* Educational Footer Banner */}
      <div className="border-t border-zinc-900 pt-2.5 flex items-center gap-2 text-[9.5px] text-zinc-400 leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
        <span>Drag nodes onto canvas, connect handles, and click <strong>Run Flow</strong> to test!</span>
      </div>

    </aside>
  );
}
