"use client"

import React, { useState } from "react"
import { useDnD } from "./DnDContext"
import { Play, Sparkles, Cpu, Database, GitFork, Download, Terminal, Search, Info } from "lucide-react"

const NODE_TYPES = [
  {
    type: "input",
    label: "Input Node",
    iconColor: "text-emerald-400 bg-emerald-950/15 border-emerald-900/30",
    hoverColor: "hover:border-emerald-500/30 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-emerald-500",
    icon: Play,
    desc: "Workflow entry point, receives variable inputs."
  },
  {
    type: "default",
    label: "Prompt",
    iconColor: "text-sky-400 bg-sky-950/15 border-sky-900/30",
    hoverColor: "hover:border-sky-500/30 hover:shadow-[0_0_15px_rgba(14,165,233,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-sky-500",
    icon: Terminal,
    desc: "Formats prompts with variable bindings."
  },
  {
    type: "default",
    label: "LLM",
    iconColor: "text-purple-400 bg-purple-950/15 border-purple-900/30",
    hoverColor: "hover:border-purple-500/30 hover:shadow-[0_0_15px_rgba(168,85,247,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-purple-500",
    icon: Sparkles,
    desc: "Executes LLM generation with custom parameters."
  },
  {
    type: "default",
    label: "Tool",
    iconColor: "text-amber-400 bg-amber-950/15 border-amber-900/30",
    hoverColor: "hover:border-amber-500/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-amber-500",
    icon: Cpu,
    desc: "Invokes web search, calculations, or scrapers."
  },
  {
    type: "default",
    label: "Memory",
    iconColor: "text-teal-400 bg-teal-950/15 border-teal-900/30",
    hoverColor: "hover:border-teal-500/30 hover:shadow-[0_0_15px_rgba(13,148,136,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-teal-500",
    icon: Database,
    desc: "Saves or loads variables to persistent memory."
  },
  {
    type: "default",
    label: "Condition",
    iconColor: "text-rose-400 bg-rose-950/15 border-rose-900/30",
    hoverColor: "hover:border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-rose-500",
    icon: GitFork,
    desc: "Routes workflow paths based on logic operators."
  },
  {
    type: "output",
    label: "Output Node",
    iconColor: "text-indigo-400 bg-indigo-950/15 border-indigo-900/30",
    hoverColor: "hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] hover:bg-zinc-900/20",
    indicatorBg: "bg-indigo-500",
    icon: Download,
    desc: "Final node, outputs text, JSON, or markdown payloads."
  }
]

export default function Sidebar() {
  const [_, setDndItem] = useDnD()
  const [search, setSearch] = useState("")

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, label: string) => {
    setDndItem({ type: nodeType, label })
    event.dataTransfer.setData("application/reactflow/type", nodeType)
    event.dataTransfer.setData("application/reactflow/label", label)
    event.dataTransfer.effectAllowed = "move"
  }

  const filteredNodes = NODE_TYPES.filter((n) =>
    n.label.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside className="w-64 p-5 bg-zinc-950 border-r border-zinc-900 text-zinc-150 flex flex-col gap-5 select-none shrink-0 h-full text-left">
      {/* Sidebar Header */}
      <div className="flex flex-col gap-1">
        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
          Node Palette
        </div>
        <p className="text-[10px] text-zinc-650 leading-relaxed">Drag nodes into the canvas to build agentic workflows</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-zinc-600" />
        <input
          type="text"
          placeholder="Filter nodes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl pl-8.5 pr-3 py-1.5 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800/60 transition-all duration-300"
        />
      </div>

      {/* Node Items List */}
      <div className="flex flex-col gap-2.5 overflow-y-auto flex-1 pr-1">
        {filteredNodes.length === 0 ? (
          <div className="text-zinc-600 text-center py-6 text-xs">No nodes match search</div>
        ) : (
          filteredNodes.map((node) => (
            <div
              key={node.label}
              className={`group border border-zinc-900 bg-zinc-900/15 rounded-xl p-3.5 cursor-grab active:cursor-grabbing transition-all duration-300 flex flex-col gap-2 relative overflow-hidden shrink-0 ${node.hoverColor}`}
              onDragStart={(event) => onDragStart(event, node.type, node.label)}
              draggable
            >
              {/* Highlight left indicator bar on hover */}
              <div className={`absolute top-0 bottom-0 left-0 w-[3.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${node.indicatorBg}`} />
              
              <div className="flex items-center gap-2.5 z-10">
                <div className={`p-1.5 rounded-lg border flex items-center justify-center shrink-0 transition-all duration-300 ${node.iconColor}`}>
                  <node.icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{node.label}</span>
              </div>
              <p className="text-[10px] text-zinc-500 leading-normal group-hover:text-zinc-400 transition-colors z-10">
                {node.desc}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Sidebar Footer info */}
      <div className="border-t border-zinc-900 pt-3 flex gap-2.5 items-start text-[9.5px] text-zinc-650 leading-relaxed">
        <Info className="w-3.5 h-3.5 shrink-0 text-zinc-700 mt-0.5" />
        <span>Double-click nodes on the canvas to rename their labels.</span>
      </div>
    </aside>
  )
}
