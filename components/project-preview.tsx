"use client"

import React, { useState, useEffect, useRef } from "react"
import { Play, Sparkles, Terminal, Cpu, Database, GitFork, ArrowRight, ArrowLeft, Plus, Trash2, CheckCircle2, RotateCcw, Layout, Mail, Bell } from "lucide-react"

interface MiniNode {
  id: string
  label: string
  type: "input" | "llm" | "tool" | "memory" | "condition" | "output"
  color: string
  x: number
  y: number
}

export default function ProjectPreview() {
  const [view, setView] = useState<"landing" | "builder">("landing")
  
  // Builder nodes state
  const [nodes, setNodes] = useState<MiniNode[]>([
    { id: "node-1", label: "User Input", type: "input", color: "border-emerald-800 text-emerald-400 bg-emerald-950/20", x: 20, y: 110 },
    { id: "node-2", label: "Gemini 1.5 Pro", type: "llm", color: "border-blue-800 text-blue-400 bg-blue-950/20", x: 190, y: 110 },
    { id: "node-3", label: "Discord Webhook", type: "output", color: "border-indigo-800 text-indigo-400 bg-indigo-950/20", x: 360, y: 110 }
  ])
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState("")

  // Simulation logs
  const [isRunning, setIsRunning] = useState(false)
  const [simStep, setSimStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([
    "▶ Console ready. Click 'Run Flow' to test workflow."
  ])

  const logContainerRef = useRef<HTMLDivElement>(null)
  const previewScrollContainerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasWidth, setCanvasWidth] = useState(500)

  useEffect(() => {
    if (!canvasRef.current) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setCanvasWidth(entry.contentRect.width || 500)
      }
    })
    observer.observe(canvasRef.current)
    return () => observer.disconnect()
  }, [])

  // Simulation steps sequence
  useEffect(() => {
    if (!isRunning) return

    const simulationSequence = [
      { log: "▶ Starting execution: 'OpenAgent Production Flow'", type: "info" },
      { log: "Node 'User Input' parsed variables successfully.", type: "input" },
      { log: "Sending context package to Node 'Gemini 1.5 Pro'...", type: "info" },
      { log: "API Call: gemini-1.5-pro responding (1,280 tokens)...", type: "llm" },
      { log: "Gemini execution successful in 680ms.", type: "success" },
      { log: "Forwarding node payload to Output Hook...", type: "info" },
      { log: "Node 'Discord Webhook' successfully executed.", type: "output" },
      { log: "✅ Workflow trigger finished. Exit code 0.", type: "success" }
    ]

    if (simStep < simulationSequence.length) {
      const timer = setTimeout(() => {
        setLogs((prev) => [...prev, simulationSequence[simStep].log])
        setSimStep((prev) => prev + 1)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setIsRunning(false)
      setSimStep(0)
    }
  }, [isRunning, simStep])

  // Scroll local logger container
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight
    }
  }, [logs])

  // Navigation handlers inside mockup
  const scrollToSection = (id: string) => {
    if (view !== "landing") {
      setView("landing")
      // Wait for view render to scroll
      setTimeout(() => {
        const el = document.getElementById(`mock-${id}`)
        if (el && previewScrollContainerRef.current) {
          previewScrollContainerRef.current.scrollTo({
            top: el.offsetTop - 50,
            behavior: "smooth"
          })
        }
      }, 100)
    } else {
      const el = document.getElementById(`mock-${id}`)
      if (el && previewScrollContainerRef.current) {
        previewScrollContainerRef.current.scrollTo({
          top: el.offsetTop - 50,
          behavior: "smooth"
        })
      }
    }
  }

  // Builder interactions
  const handleRunFlow = () => {
    if (isRunning) return
    setLogs([])
    setIsRunning(true)
    setSimStep(0)
  }

  const handleAddNode = (type: "tool" | "memory" | "condition") => {
    if (nodes.length >= 6) {
      setLogs((l) => [...l, "⚠ Max nodes reached for preview mockup!"])
      return
    }

    const typeConfig = {
      tool: { label: "Google Search", color: "border-amber-850 text-amber-400 bg-amber-950/20" },
      memory: { label: "Variables Memory", color: "border-teal-850 text-teal-400 bg-teal-950/20" },
      condition: { label: "Filter Logic", color: "border-rose-850 text-rose-400 bg-rose-950/20" }
    }[type]

    const newId = `node-${Date.now()}`
    const newNode: MiniNode = {
      id: newId,
      label: typeConfig.label,
      type,
      color: typeConfig.color,
      x: 100 + (nodes.length * 25),
      y: 160 + (nodes.length % 2 === 0 ? 20 : -10)
    }

    setNodes((n) => [...n, newNode])
    setLogs((l) => [...l, `[Editor] Spawned custom ${type.toUpperCase()} node: "${typeConfig.label}"`])
  }

  const handleDeleteNode = (id: string) => {
    if (id === "node-1" || id === "node-2" || id === "node-3") {
      setLogs((l) => [...l, "⚠ Default trigger/output nodes cannot be deleted."])
      return
    }
    const nodeToDelete = nodes.find((n) => n.id === id)
    setNodes((n) => n.filter((node) => node.id !== id))
    setSelectedNodeId(null)
    if (nodeToDelete) {
      setLogs((l) => [...l, `[Editor] Deleted node: "${nodeToDelete.label}"`])
    }
  }

  const handleSelectNode = (node: MiniNode) => {
    setSelectedNodeId(node.id)
    setRenameValue(node.label)
  }

  const handleRenameNode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNodeId || !renameValue.trim()) return
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          return { ...node, label: renameValue }
        }
        return node
      })
    )
    setLogs((l) => [...l, `[Editor] Renamed node to: "${renameValue}"`])
    setSelectedNodeId(null)
  }

  const handleResetCanvas = () => {
    setNodes([
      { id: "node-1", label: "User Input", type: "input", color: "border-emerald-800 text-emerald-400 bg-emerald-950/20", x: 20, y: 110 },
      { id: "node-2", label: "Gemini 1.5 Pro", type: "llm", color: "border-blue-800 text-blue-400 bg-blue-950/20", x: 190, y: 110 },
      { id: "node-3", label: "Discord Webhook", type: "output", color: "border-indigo-800 text-indigo-400 bg-indigo-950/20", x: 360, y: 110 }
    ])
    setSelectedNodeId(null)
    setLogs(["▶ Canvas state reset. Trigger nodes loaded."])
  }

  const scaleFactor = canvasWidth < 500 ? canvasWidth / 500 : 1

  return (
    <div className="w-full text-zinc-300 font-sans select-none bg-zinc-950 min-h-[500px] flex flex-col text-left h-full relative overflow-hidden">
      {/* Cool dotted grid background inside mock PC screen */}
      <div className="absolute inset-0 bg-[radial-gradient(#1c1c24_1.2px,transparent_1.2px)] [background-size:14px_14px] opacity-70 pointer-events-none z-0" />
      {/* Mock Browser Header Chrome */}
      <div className="w-full bg-zinc-900 border-b border-zinc-850 px-3.5 py-2.5 flex items-center justify-between sticky top-0 z-30 shrink-0 select-none">
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80 cursor-pointer hover:bg-red-400" onClick={() => setView("landing")} title="Go Home" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        
        {/* Working Mini Browser Tab Address bar */}
        <div className="flex-grow max-w-sm mx-auto bg-zinc-950 border border-zinc-850 rounded-md py-0.5 px-2 text-[9px] text-zinc-500 font-mono text-center flex items-center justify-center gap-1">
          <span className="text-zinc-700">https://</span>openagent.ai{view === "landing" ? "" : "/builder"}
        </div>
        
        <div className="shrink-0 flex items-center gap-1.5">
          <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-950/40 text-blue-400 font-bold border border-blue-900/30">PREVIEW</span>
        </div>
      </div>

      {/* Main Interactive Screen Content */}
      <div 
        ref={previewScrollContainerRef}
        className="flex-1 overflow-y-auto w-full flex flex-col bg-zinc-950 scroll-smooth relative"
        style={{ scrollbarWidth: "thin" }}
      >
        {/* VIEW 1: HERO LANDING PAGE */}
        {view === "landing" && (
          <div className="flex flex-col flex-grow min-h-full">
            {/* Floating Capsule Navbar Mockup (Exactly like our website!) */}
            <div className="w-full px-3 py-2.5 sticky top-0 z-20 bg-zinc-950/90 border-b border-zinc-900/60 backdrop-blur-md flex items-center justify-between">
              <div className="flex items-center gap-1.5 cursor-pointer shrink-0" onClick={() => setView("landing")}>
                <div className="flex items-center justify-center w-4 h-4 shrink-0 text-cyan-400">
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 12L12 6M12 6L18 12M12 6V18M6 12L12 18M12 18L18 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex flex-col items-start leading-none gap-0.5">
                  <span className="font-black text-[9px] tracking-tight bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent">
                    OpenAgent
                  </span>
                  <span className="text-[5.5px] font-black tracking-widest bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 text-transparent uppercase">
                    ~ GDG JIIT 128
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3.5 text-[8px] text-zinc-500 font-bold">
                <button onClick={() => setView("landing")} className="text-zinc-200 hover:text-white transition-colors cursor-pointer">Home</button>
                <button onClick={() => scrollToSection("features")} className="hover:text-white transition-colors cursor-pointer">Features</button>
                <button onClick={() => setView("builder")} className="hover:text-white transition-colors cursor-pointer">Builder</button>
                <button onClick={() => scrollToSection("contact")} className="hover:text-white transition-colors cursor-pointer">Contact</button>
              </div>
              <button
                onClick={() => setView("builder")}
                className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[8px] font-bold transition-all cursor-pointer shadow-md"
              >
                Launch
              </button>
            </div>

            {/* Hero Main Content (Exactly like our website hero layout!) */}
            <div id="mock-hero" className="flex-1 flex flex-col items-center justify-center text-center px-4 py-12 max-w-lg mx-auto gap-4">
              <h3 className="text-2xl font-black tracking-tight text-white leading-tight bg-clip-text bg-gradient-to-b from-white to-zinc-400">
                OpenAgent
              </h3>
              <p className="text-[10px] text-zinc-400 max-w-xs leading-relaxed">
                The visual workspace for autonomous intelligence. Connect Gemini models, chain execution tools, and orchestrate stateful agent loops in seconds.
              </p>
              
              <div className="flex items-center gap-2 mt-1">
                <button
                  onClick={() => setView("builder")}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-[9px] font-bold transition-all flex items-center gap-1 shadow-lg shadow-blue-950/40 cursor-pointer"
                >
                  Launch Builder <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => scrollToSection("features")}
                  className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 rounded-md text-[9px] font-bold transition-colors cursor-pointer"
                >
                  Explore Features
                </button>
              </div>
            </div>

            {/* Platform Capabilities Section (Exactly like our website capabilities grid!) */}
            <div id="mock-features" className="border-t border-zinc-900 bg-zinc-950 p-4 flex flex-col gap-3 mt-auto">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-extrabold text-white">Platform Capabilities</span>
                <span className="text-[7.5px] text-zinc-500">Everything you need to design and deploy agentic workflows.</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 pb-4">
                {/* Capability 1 */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-2.5 flex flex-col gap-1.5 hover:border-blue-500/20 transition-all group">
                  <div className="p-1 rounded bg-blue-950/20 border border-blue-900/30 text-blue-400 w-fit">
                    <Layout className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-white group-hover:text-blue-400 transition-colors">Drag-&-Drop Designer</span>
                    <p className="text-[7.5px] text-zinc-500 leading-snug">Wire up inputs, prompts, and memory logic.</p>
                  </div>
                  <button onClick={() => setView("builder")} className="text-[7px] font-semibold text-blue-400 flex items-center gap-0.5 hover:text-blue-300 transition-colors mt-auto w-fit">
                    Open Builder <ArrowRight className="w-2 h-2" />
                  </button>
                </div>

                {/* Capability 2 */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-2.5 flex flex-col gap-1.5 hover:border-purple-500/20 transition-all group">
                  <div className="p-1 rounded bg-purple-950/20 border border-purple-900/30 text-purple-400 w-fit">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-white group-hover:text-purple-400 transition-colors">Gemini Nodes</span>
                    <p className="text-[7.5px] text-zinc-500 leading-snug">Configure Gemini models with custom parameters.</p>
                  </div>
                </div>

                {/* Capability 3 */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-2.5 flex flex-col gap-1.5 hover:border-amber-500/20 transition-all group">
                  <div className="p-1 rounded bg-amber-950/20 border border-amber-900/30 text-amber-400 w-fit">
                    <Cpu className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-white group-hover:text-amber-400 transition-colors">Integration Tools</span>
                    <p className="text-[7.5px] text-zinc-500 leading-snug">Web search, scraper, calculator, and hooks.</p>
                  </div>
                </div>

                {/* Capability 4 */}
                <div className="bg-zinc-900/40 border border-zinc-900 rounded-xl p-2.5 flex flex-col gap-1.5 hover:border-teal-500/20 transition-all group">
                  <div className="p-1 rounded bg-teal-950/20 border border-teal-900/30 text-teal-400 w-fit">
                    <Database className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-bold text-white group-hover:text-teal-400 transition-colors">Memory Loops</span>
                    <p className="text-[7.5px] text-zinc-500 leading-snug">Save context variables between node steps.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock Contact section */}
            <div id="mock-contact" className="border-t border-zinc-900 bg-zinc-950 p-4 pb-8 flex flex-col gap-2.5">
              <span className="text-[9px] font-extrabold text-white">Connect With Us</span>
              <p className="text-[7.5px] text-zinc-500">Have questions about OpenAgent? Reach out directly.</p>
              <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3 flex justify-between items-center">
                <span className="text-[8px] text-zinc-300 font-semibold flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-blue-400" /> contact@openagent.ai
                </span>
                <span className="text-[7px] text-zinc-500">Inquiry email</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE BUILDER PAGE */}
        {view === "builder" && (
          <div className="flex flex-col flex-grow min-h-full">
            {/* Custom Builder Navbar Capsule inside mockup */}
            <div className="w-full px-3 py-2 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between z-10 select-none shrink-0 gap-2 flex-wrap">
              <button
                onClick={() => setView("landing")}
                className="px-2 py-1 bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 rounded-md text-[8.5px] font-bold flex items-center gap-0.5 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-2.5 h-2.5" /> Back
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleAddNode("tool")}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[8.5px] rounded-md text-zinc-300 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Add Search Tool Node"
                >
                  <Plus className="w-2.5 h-2.5 text-amber-500" /> Tool
                </button>
                <button
                  onClick={() => handleAddNode("condition")}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-[8.5px] rounded-md text-zinc-300 font-semibold flex items-center gap-0.5 transition-colors cursor-pointer"
                  title="Add Condition Node"
                >
                  <Plus className="w-2.5 h-2.5 text-rose-500" /> logic
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetCanvas}
                  className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-455 hover:text-zinc-200 text-[8.5px] font-semibold rounded-md border border-zinc-850 flex items-center gap-0.5 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-2.5 h-2.5" /> Reset
                </button>
                <button
                  onClick={handleRunFlow}
                  disabled={isRunning}
                  className={`px-3 py-1 text-[8.5px] font-black rounded-md shadow-md flex items-center gap-1 transition-all cursor-pointer ${
                    isRunning
                      ? "bg-amber-600/30 text-amber-300 border border-amber-500/20 cursor-not-allowed animate-pulse"
                      : "bg-emerald-600 hover:bg-emerald-500 text-white"
                  }`}
                >
                  <Play className="w-2.5 h-2.5 fill-current" />
                  {isRunning ? "Running..." : "Run Flow"}
                </button>
              </div>
            </div>

            {/* Builder Canvas Area Layout */}
            <div 
              ref={canvasRef}
              className="flex-grow flex flex-col md:flex-row relative min-h-[250px] border-b border-zinc-900 overflow-hidden bg-zinc-950"
            >
              {/* Canvas grid background */}
              <div className="absolute inset-0 bg-[radial-gradient(#1f1f23_1px,transparent_1px)] [background-size:12px_12px] opacity-60 pointer-events-none" />

              {/* Scaling Wrapper for Mobile Responsiveness */}
              <div 
                style={{ 
                  transform: `scale(${scaleFactor})`, 
                  transformOrigin: "top left",
                  width: "500px",
                  height: `${240 / scaleFactor}px`
                }}
                className="relative flex-grow h-full min-h-[220px]"
              >
                {/* Dynamic Connecting SVG Paths */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  {nodes.length >= 2 && (
                    <>
                      {/* Trigger to node-2 */}
                      <path d="M100 120 L190 120" stroke="#27272a" strokeWidth="1.5" fill="none" />
                      {isRunning && simStep >= 2 && (
                        <circle cx="145" cy="120" r="2.5" fill="#60a5fa" className="animate-ping" />
                      )}

                      {/* Node-2 to output */}
                      <path d="M290 120 L360 120" stroke="#27272a" strokeWidth="1.5" fill="none" />
                      {isRunning && simStep >= 5 && (
                        <circle cx="325" cy="120" r="2.5" fill="#818cf8" className="animate-ping" />
                      )}
                    </>
                  )}
                  {/* Dynamically connecting custom items */}
                  {nodes.filter(n => n.type !== "input" && n.type !== "llm" && n.type !== "output").map((node) => (
                    <path
                      key={node.id}
                      d={`M190 120 Q ${node.x + 30} 80, ${node.x + 60} ${node.y}`}
                      stroke="#1c1c22"
                      strokeWidth="1.2"
                      strokeDasharray="3,3"
                      fill="none"
                    />
                  ))}
                </svg>

                {/* Render Draggable Nodes list state */}
                <div className="absolute inset-0 p-4">
                  {nodes.map((node) => (
                    <div
                      key={node.id}
                      onClick={() => handleSelectNode(node)}
                      className={`absolute border rounded-xl p-2 shadow-lg w-32 cursor-pointer transition-all hover:scale-[1.02] flex flex-col gap-1 ${node.color} ${
                        selectedNodeId === node.id ? "ring-2 ring-blue-500/80 border-blue-400" : ""
                      }`}
                      style={{ left: `${node.x}px`, top: `${node.y}px` }}
                    >
                      <div className="flex items-center justify-between text-[7px] font-bold opacity-60 border-b border-zinc-900 pb-0.5 uppercase tracking-wide">
                        <span>{node.type}</span>
                        <span className="w-1 h-1 rounded-full bg-current" />
                      </div>
                      <span className="text-[9px] font-bold text-zinc-150 truncate">{node.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mini Property edit form (displays when node clicked) */}
              {selectedNodeId && (
                <div className="absolute top-2 right-2 z-20 w-44 bg-zinc-950/95 border border-zinc-800 rounded-xl p-3 shadow-2xl backdrop-blur-md text-[9px] flex flex-col gap-2">
                  <div className="flex justify-between items-center pb-1 border-b border-zinc-900 font-bold text-zinc-400">
                    <span>EDIT NODE</span>
                    <button onClick={() => setSelectedNodeId(null)} className="text-zinc-600 hover:text-zinc-200">
                      ✕
                    </button>
                  </div>
                  <form onSubmit={handleRenameNode} className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <span className="text-[7px] font-bold text-zinc-500">RENAME LABEL</span>
                      <input
                        type="text"
                        value={renameValue}
                        onChange={(e) => setRenameValue(e.target.value)}
                        className="bg-zinc-900 text-zinc-200 px-2 py-1 rounded border border-zinc-800 focus:outline-none focus:border-zinc-700 text-[9px] w-full"
                      />
                    </div>
                    <div className="flex gap-1.5 mt-1">
                      <button
                        type="submit"
                        className="flex-1 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[8px] font-bold cursor-pointer"
                      >
                        Apply
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteNode(selectedNodeId)}
                        className="px-2 py-1 bg-red-950/40 hover:bg-red-900 text-red-300 rounded border border-red-900/20 text-[8px] flex items-center justify-center cursor-pointer"
                        title="Delete Node"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Workflow Console Log display inside screen */}
            <div className="w-full bg-zinc-900/90 border-t border-zinc-900 p-3 font-mono text-[9px] text-zinc-400 flex flex-col gap-1.5 shrink-0 select-none">
              <div className="flex justify-between items-center pb-1 border-b border-zinc-800 font-bold text-zinc-500">
                <span className="flex items-center gap-1.5"><Terminal className="w-3 h-3" /> WORKFLOW CONSOLE</span>
                {isRunning ? (
                  <span className="text-[7px] bg-emerald-950 text-emerald-400 border border-emerald-900/60 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" /> Run Active
                  </span>
                ) : (
                  <span className="text-[7px] bg-zinc-950 text-zinc-600 px-1.5 py-0.5 rounded-full">Idle</span>
                )}
              </div>
              <div ref={logContainerRef} className="flex flex-col gap-0.5 overflow-y-auto max-h-20 text-left leading-relaxed">
                {logs.map((log, index) => {
                  let color = "text-zinc-500"
                  if (log.includes("▶") || log.includes("✅")) color = "text-emerald-400 font-semibold"
                  else if (log.includes("Calling") || log.includes("API")) color = "text-blue-400"
                  else if (log.includes("Spawned") || log.includes("Deleted")) color = "text-purple-400"
                  else if (log.includes("⚠")) color = "text-rose-400"
                  else if (log.includes("[Editor]")) color = "text-zinc-400"

                  return (
                    <div key={index} className={color}>
                      {log}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
