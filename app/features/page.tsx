"use client"

import React, { useState } from "react"
import Navbar from "@/components/navbar"
import AuroraButton from "@/components/aurora-button"
import WavyGridBackground from "@/components/wavy-grid-background"
import { useRouter } from "next/navigation"
import { ArrowLeft, Sparkles, Layout, Cpu, Database, Code, ArrowRight } from "lucide-react"

export default function FeaturesPage() {
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(0)

  const techSteps = [
    {
      step: "01",
      title: "Authentication & Gemini Setup",
      subtitle: "Initializing the Gemini Brain Node",
      where: "Main workspace canvas (visual center screen).",
      how: "Double-click the LLM node block inside the canvas workspace.",
      action: "A configuration settings popup modal will slide open. Paste your secure Google Gemini API key into the input field and adjust model parameters (temperature, token thresholds).",
      example: "Paste your secure Gemini key: 'AIzaSyD-...' to authenticate and unlock model execution logic.",
      snippet: (
        <div className="w-full">
          <div><span className="text-blue-400">{"{"}</span></div>
          <div className="pl-4"><span className="text-sky-400">&quot;id&quot;</span>: <span className="text-emerald-400">&quot;node-gemini-llm&quot;</span>,</div>
          <div className="pl-4"><span className="text-sky-400">&quot;type&quot;</span>: <span className="text-emerald-400">&quot;llm&quot;</span>,</div>
          <div className="pl-4"><span className="text-sky-400">&quot;data&quot;</span>: <span className="text-blue-400">{"{"}</span></div>
          <div className="pl-8"><span className="text-sky-400">&quot;model&quot;</span>: <span className="text-emerald-400">&quot;gemini-2.0-flash&quot;</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;apiKey&quot;</span>: <span className="text-emerald-450">&quot;AIzaSyD-xxxxxxxxxxxxxx&quot;</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;temperature&quot;</span>: <span className="text-purple-400">0.7</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;maxTokens&quot;</span>: <span className="text-purple-400">1024</span></div>
          <div className="pl-4"><span className="text-blue-400">{"}"}</span></div>
          <div><span className="text-blue-400">{"}"}</span></div>
        </div>
      ),
      tip: "Your API key is stored securely in the browser state memory and is only sent directly to Google Gemini's endpoints during node execution loops."
    },
    {
      step: "02",
      title: "Visual Connection Mapping",
      subtitle: "Wiring Canvas Connector Edges",
      where: "Floating node palette sidebar (on the left side of the canvas).",
      how: "Drag triggers or prompt blocks onto the visual canvas. Hover your cursor over connector circles, click and drag a line, and link to a target node handle.",
      action: "Link triggers, Gemini prompts, and output handles together to outline the logical sequence of data flow.",
      example: "Wire the connector handle of an Input node (User query) directly to the target LLM prompt socket to pass context values.",
      snippet: (
        <div className="w-full">
          <div><span className="text-blue-400">[</span></div>
          <div className="pl-4"><span className="text-blue-400">{"{"}</span></div>
          <div className="pl-8"><span className="text-sky-400">&quot;id&quot;</span>: <span className="text-emerald-400">&quot;edge-input-to-llm&quot;</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;source&quot;</span>: <span className="text-emerald-400">&quot;input-query&quot;</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;target&quot;</span>: <span className="text-emerald-400">&quot;node-gemini-llm&quot;</span></div>
          <div className="pl-4"><span className="text-blue-400">{"}"}</span></div>
          <div><span className="text-blue-400">]</span></div>
        </div>
      ),
      tip: "Handles support standard dynamic input bindings, allowing you to reference upstream values using standard double curly syntax like {{input-query.value}}."
    },
    {
      step: "03",
      title: "Equipping Third-Party Tools",
      subtitle: "Attaching Scrapers & API Connectors",
      where: "Floating Settings Drawer (opens on the right side of the canvas when a node is clicked).",
      how: "Drag an API node, click it, enter request properties, and specify URL parameters.",
      action: "Link dynamic connection nodes to let your agent search the web, execute custom math, scrape pages, or trigger booking services.",
      example: "Set up a Goibibo train booking search API endpoint to fetch ticket availability dynamically based on extracted LLM parameters.",
      snippet: (
        <div className="w-full">
          <div><span className="text-blue-400">{"{"}</span></div>
          <div className="pl-4"><span className="text-sky-400">&quot;id&quot;</span>: <span className="text-emerald-400">&quot;goibibo-api-search&quot;</span>,</div>
          <div className="pl-4"><span className="text-sky-400">&quot;type&quot;</span>: <span className="text-emerald-400">&quot;api&quot;</span>,</div>
          <div className="pl-4"><span className="text-sky-400">&quot;data&quot;</span>: <span className="text-blue-400">{"{"}</span></div>
          <div className="pl-8"><span className="text-sky-400">&quot;url&quot;</span>: <span className="text-emerald-450">&quot;https://api.goibibo.com/trains/search&quot;</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;method&quot;</span>: <span className="text-emerald-400">&quot;GET&quot;</span>,</div>
          <div className="pl-8"><span className="text-sky-400">&quot;params&quot;</span>: <span className="text-blue-400">{"{"}</span></div>
          <div className="pl-12"><span className="text-sky-400">&quot;source&quot;</span>: <span className="text-blue-300">&quot;{"{{node-gemini-llm.source}}"}&quot;</span>,</div>
          <div className="pl-12"><span className="text-sky-400">&quot;destination&quot;</span>: <span className="text-blue-300">&quot;{"{{node-gemini-llm.destination}}"}&quot;</span></div>
          <div className="pl-8"><span className="text-blue-400">{"}"}</span></div>
          <div className="pl-4"><span className="text-blue-400">{"}"}</span></div>
          <div><span className="text-blue-400">{"}"}</span></div>
        </div>
      ),
      tip: "Dynamic variables inside double curlies get resolved dynamically by the pipeline engine prior to making HTTP requests."
    },
    {
      step: "04",
      title: "Executing the Agent Loop",
      subtitle: "Topological Sorting & Run Execution",
      where: "Top Action Control Bar (floating at the top center).",
      how: "Click the 'Run Flow' play button inside the workspace action header.",
      action: "Click 'Run Flow' in the top action bar to execute the agent. The orchestrator topologically sorts connection handles, compiles logic streams, and runs code.",
      example: "Run the booking agent. Watch the paths light up in real time, and trace state details inside the console panel.",
      snippet: (
        <div className="w-full">
          <div><span className="text-zinc-500">// Server-Side Orchestration dry-run</span></div>
          <div><span className="text-purple-400">const</span> <span className="text-zinc-200">executionOrder</span> = <span className="text-blue-400">topologicalSort</span>(<span className="text-zinc-450">nodes</span>, <span className="text-zinc-450">edges</span>);</div>
          <div><span className="text-purple-400">for</span> (<span className="text-purple-400">const</span> <span className="text-zinc-200">node</span> <span className="text-purple-400">of</span> <span className="text-zinc-200">executionOrder</span>) <span className="text-blue-400">{"{"}</span></div>
          <div className="pl-4"><span className="text-purple-400">const</span> <span className="text-zinc-200">resolvedData</span> = <span className="text-blue-400">parseVariables</span>(<span className="text-zinc-450">node.data</span>, <span className="text-zinc-450">memory</span>);</div>
          <div className="pl-4"><span className="text-purple-400">const</span> <span className="text-zinc-200">result</span> = <span className="text-purple-400">await</span> <span className="text-blue-400">executeNode</span>(<span className="text-zinc-450">node.type</span>, <span className="text-zinc-450">resolvedData</span>);</div>
          <div className="pl-4"><span className="text-zinc-450">memory</span>.<span className="text-blue-450">set</span>(<span className="text-zinc-450">node.id</span>, <span className="text-zinc-450">result</span>);</div>
          <div><span className="text-blue-400">{"}"}</span></div>
        </div>
      ),
      tip: "If a node fails or needs refinement, the execution logs console immediately captures and reports errors with standard exit codes."
    }
  ]

  return (
    <div className="relative min-h-screen bg-zinc-950 text-foreground flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden">
      
      {/* Background Dots Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <WavyGridBackground squareSize={3} maxOpacity={0.12} gridGap={10} height={1800} />
      </div>

      {/* Floating Capsule Navbar */}
      <Navbar />

      {/* Hero Header */}
      <section className="relative z-10 w-full max-w-5xl px-6 md:px-8 pt-32 pb-8 flex flex-col gap-4 text-left select-none">
        <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Documentation</span>
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.15)] tracking-tight leading-none">
          Technical Capabilities
        </h1>
        <p className="text-zinc-500 text-sm md:text-base max-w-2xl leading-relaxed">
          Explore how OpenAgent compiles drag-and-drop workspace nodes into high-performance execution arrays under the hood.
        </p>
      </section>

      {/* Visual Flowchart Tutorial Map */}
      <section className="relative z-10 w-full max-w-5xl px-6 md:px-8 py-4 select-none">
        <div className="w-full bg-zinc-950/30 border border-zinc-900 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md shadow-2xl">
          {/* Ambient background glow inside guide box */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.04),transparent_70%)] pointer-events-none" />
          <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest font-mono block mb-5 text-center">Interactive Workspace Guide</span>
          
          <div className="flex flex-col md:flex-row items-stretch justify-between gap-4 relative">
            
            {/* Flow 1 */}
            <div 
              onClick={() => setActiveStep(0)}
              className={`flex-1 w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-center hover:-translate-y-1 ${
                activeStep === 0 
                  ? "bg-blue-950/20 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15),inset_0_0_12px_rgba(59,130,246,0.05)] scale-[1.02]" 
                  : "bg-zinc-950/35 border-zinc-900/60 hover:border-zinc-800"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                activeStep === 0 ? "bg-blue-500 text-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.5)] font-black" : "bg-zinc-900 text-zinc-500"
              }`}>
                1
              </div>
              <span className="text-[10px] font-bold text-white">Double-Click LLM</span>
              <span className="text-[9px] text-zinc-500 leading-normal max-w-[150px]">Open configuration modal and paste API key</span>
            </div>

            {/* Connecting Arrow */}
            <div className={`hidden md:flex items-center justify-center shrink-0 select-none transition-all duration-300 ${
              activeStep >= 1 ? "text-blue-500/55 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "text-blue-500/15"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>

            {/* Flow 2 */}
            <div 
              onClick={() => setActiveStep(1)}
              className={`flex-1 w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-center hover:-translate-y-1 ${
                activeStep === 1 
                  ? "bg-blue-950/20 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15),inset_0_0_12px_rgba(59,130,246,0.05)] scale-[1.02]" 
                  : "bg-zinc-950/35 border-zinc-900/60 hover:border-zinc-800"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                activeStep === 1 ? "bg-blue-500 text-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.5)] font-black" : "bg-zinc-900 text-zinc-500"
              }`}>
                2
              </div>
              <span className="text-[10px] font-bold text-white">Drag & Drop Nodes</span>
              <span className="text-[9px] text-zinc-500 leading-normal max-w-[150px]">Drag blocks from sidebar onto visual canvas</span>
            </div>

            {/* Connecting Arrow */}
            <div className={`hidden md:flex items-center justify-center shrink-0 select-none transition-all duration-300 ${
              activeStep >= 2 ? "text-blue-500/55 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "text-blue-500/15"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>

            {/* Flow 3 */}
            <div 
              onClick={() => setActiveStep(2)}
              className={`flex-1 w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-center hover:-translate-y-1 ${
                activeStep === 2 
                  ? "bg-blue-950/20 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15),inset_0_0_12px_rgba(59,130,246,0.05)] scale-[1.02]" 
                  : "bg-zinc-950/35 border-zinc-900/60 hover:border-zinc-800"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                activeStep === 2 ? "bg-blue-500 text-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.5)] font-black" : "bg-zinc-900 text-zinc-500"
              }`}>
                3
              </div>
              <span className="text-[10px] font-bold text-white">Link Connectors</span>
              <span className="text-[9px] text-zinc-500 leading-normal max-w-[150px]">Drag connecting lines between node sockets</span>
            </div>

            {/* Connecting Arrow */}
            <div className={`hidden md:flex items-center justify-center shrink-0 select-none transition-all duration-300 ${
              activeStep >= 3 ? "text-blue-500/55 drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]" : "text-blue-500/15"
            }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            </div>

            {/* Flow 4 */}
            <div 
              onClick={() => setActiveStep(3)}
              className={`flex-1 w-full flex flex-col items-center gap-2.5 p-4 rounded-2xl border transition-all duration-300 cursor-pointer text-center hover:-translate-y-1 ${
                activeStep === 3 
                  ? "bg-blue-950/20 border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.15),inset_0_0_12px_rgba(59,130,246,0.05)] scale-[1.02]" 
                  : "bg-zinc-950/35 border-zinc-900/60 hover:border-zinc-800"
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                activeStep === 3 ? "bg-blue-500 text-zinc-950 shadow-[0_0_15px_rgba(59,130,246,0.5)] font-black" : "bg-zinc-900 text-zinc-500"
              }`}>
                4
              </div>
              <span className="text-[10px] font-bold text-white">Trigger Live Run</span>
              <span className="text-[9px] text-zinc-500 leading-normal max-w-[150px]">Click 'Run Flow' to execute the orchestrator</span>
            </div>

          </div>
        </div>
      </section>

      {/* Subtle glowing spacer line */}
      <div className="w-full max-w-5xl h-[1px] bg-gradient-to-r from-transparent via-zinc-900 to-transparent my-4" />

      {/* Interactive Hub Steps Section */}
      <section className="relative z-10 w-full max-w-5xl px-6 md:px-8 py-4 flex flex-col lg:flex-row gap-8 items-start mb-20 select-none">
        
        {/* Left Column Steps Selector Tabs */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-3 text-left">
          <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest font-mono mb-1 pl-1">Pipeline Stages</span>
          {techSteps.map((item, index) => (
            <button
              key={item.step}
              onClick={() => setActiveStep(index)}
              className={`w-full p-4 rounded-2xl border transition-all duration-300 flex items-center gap-4 cursor-pointer text-left hover:scale-[1.01] relative ${
                activeStep === index
                  ? "bg-blue-950/25 border-blue-500/40 text-white shadow-[0_0_20px_rgba(59,130,246,0.1)]"
                  : "bg-zinc-950/25 border-zinc-900/60 text-zinc-400 hover:border-zinc-850 hover:bg-zinc-950/40"
              }`}
            >
              {activeStep === index && (
                <div className="absolute left-0 top-3.5 bottom-3.5 w-[3px] bg-blue-500 rounded-r shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}
              <span className={`font-mono text-xs font-black px-2 py-0.5 rounded transition-colors ${
                activeStep === index ? "bg-blue-500 text-zinc-950" : "bg-zinc-900 text-zinc-500"
              }`}>
                {item.step}
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] uppercase font-black tracking-wider opacity-60 font-mono">
                  {item.step === "01" ? "Setup" : item.step === "02" ? "Canvas" : item.step === "03" ? "Integrations" : "Execution"}
                </span>
                <span className="text-xs font-bold">{item.title}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Right Column Step Detail & Code Editor */}
        <div className="flex-1 flex flex-col gap-6 text-left w-full">
          
          {/* Details Card */}
          <div className="w-full bg-zinc-950/45 border border-zinc-900/60 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl backdrop-blur-md">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 blur-3xl rounded-full pointer-events-none" />
            <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest font-mono">
                {techSteps[activeStep].subtitle}
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight leading-none">
                {techSteps[activeStep].title}
              </h2>
              {/* Structured Instructions */}
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-start gap-2.5 text-xs">
                  <span className="shrink-0 px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider uppercase bg-blue-950/40 text-blue-400 border border-blue-900/30 font-mono">
                    Where
                  </span>
                  <span className="text-zinc-300">{techSteps[activeStep].where}</span>
                </div>
                
                <div className="flex items-start gap-2.5 text-xs">
                  <span className="shrink-0 px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider uppercase bg-sky-950/40 text-sky-400 border border-sky-900/30 font-mono">
                    How
                  </span>
                  <span className="text-zinc-300">{techSteps[activeStep].how}</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs">
                  <span className="shrink-0 px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider uppercase bg-indigo-950/40 text-indigo-400 border border-indigo-900/30 font-mono">
                    Setup
                  </span>
                  <span className="text-zinc-300">{techSteps[activeStep].action}</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs border-t border-zinc-900/40 pt-3 mt-1">
                  <span className="shrink-0 px-2 py-0.5 rounded text-[8.5px] font-black tracking-wider uppercase bg-zinc-800 text-zinc-300 border border-zinc-700/40 font-mono">
                    Example
                  </span>
                  <span className="text-zinc-400 leading-relaxed italic">{techSteps[activeStep].example}</span>
                </div>
              </div>
              
              {/* Pro Tip Box */}
              <div className="mt-4 bg-blue-950/5 border border-blue-900/20 rounded-2xl p-4 text-[11px] text-blue-300/90 leading-relaxed shadow-inner">
                <span className="font-bold text-blue-400 uppercase tracking-wider text-[9px] block mb-1">PRO TIP</span>
                {techSteps[activeStep].tip}
              </div>
            </div>
          </div>

          {/* Code IDE Container */}
          <div className="bg-zinc-950/70 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[260px] w-full">
            {/* Header bar */}
            <div className="bg-zinc-950/90 border-b border-zinc-900/80 px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500/60" />
                <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                <span className="w-2 h-2 rounded-full bg-green-500/60" />
              </div>
              <div className="text-[9.5px] font-mono text-zinc-500 font-bold tracking-wider flex items-center gap-1.5">
                {activeStep === 3 ? (
                  <>
                    <span className="text-[7.5px] px-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded font-black font-sans">TS</span>
                    orchestrator.ts
                  </>
                ) : (
                  <>
                    <span className="text-[7.5px] px-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded font-black font-sans">{"{}"}</span>
                    config.json
                  </>
                )}
              </div>
              <div className="p-1 text-zinc-600">
                <Code className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Split Code View Gutter + Content */}
            <div className="flex flex-row overflow-x-auto flex-grow bg-zinc-950/40">
              {/* Fake Line Numbers Gutter */}
              <div className="px-3.5 py-5 border-r border-zinc-900/60 select-none text-right font-mono text-[10px] text-zinc-600 flex flex-col gap-0">
                {Array.from({ length: activeStep === 0 ? 10 : activeStep === 1 ? 7 : activeStep === 2 ? 12 : 7 }).map((_, idx) => (
                  <div key={idx}>{idx + 1}</div>
                ))}
              </div>
              {/* Code Body Content */}
              <pre className="p-5 font-mono text-[10px] md:text-[11px] leading-relaxed text-zinc-450 overflow-x-auto flex-grow flex items-center text-left">
                <code className="w-full whitespace-pre">{techSteps[activeStep].snippet}</code>
              </pre>
            </div>
          </div>

        </div>

      </section>

      {/* CTA Bottom Banner */}
      <section className="relative z-10 w-full max-w-5xl px-6 md:px-8 mb-16 select-none">
        <div className="w-full bg-gradient-to-r from-blue-950/10 via-zinc-900/10 to-blue-950/10 border border-zinc-900/60 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="text-left flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">Ready to compile your first agent?</h3>
            <p className="text-zinc-500 text-xs max-w-md leading-relaxed">
              Launch the live builder workspace, wire up Gemini nodes, integrate Goibibo or search tools, and watch the execution loop.
            </p>
          </div>
          <AuroraButton 
            onClick={() => router.push("/builder")}
            label="Open Workspace Builder"
            variant="inverted"
            beamColor="59, 130, 246"
            duration="5s"
          />
        </div>
      </section>

    </div>
  )
}
