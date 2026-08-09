"use client"

import Navbar from "@/components/navbar"
import ProjectPreview from "@/components/project-preview"
import AuroraButton from "@/components/aurora-button"
import LaptopMockup from "@/components/laptop-mockup"
import WavyGridBackground from "@/components/wavy-grid-background"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, Layout, Sparkles, Cpu, Database } from "lucide-react"

const agentSteps = [
  {
    title: "Enter Gemini API Key",
    stepNum: "Step 01",
    description: "Double-click the LLM tab inside the builder workspace, enter your secure Google Gemini API key, and configure your model parameters.",
    icon: Sparkles,
    borderClass: "hover:border-blue-500/40",
    shadowClass: "hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.2)]",
    glowClass: "from-blue-500/5",
    iconClass: "bg-blue-950/20 border-blue-900/40 text-blue-400 group-hover:border-blue-500/40 group-hover:text-blue-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.25)]",
    hasLink: true
  },
  {
    title: "Drag & Connect Nodes",
    stepNum: "Step 02",
    description: "Drag inputs, prompts, memory parameters, and output hooks onto the visual workspace canvas. Wire their connector nodes together.",
    icon: Layout,
    borderClass: "hover:border-sky-500/40",
    shadowClass: "hover:shadow-[0_20px_40px_-15px_rgba(14,165,233,0.2)]",
    glowClass: "from-sky-500/5",
    iconClass: "bg-sky-950/20 border-sky-900/40 text-sky-400 group-hover:border-sky-500/40 group-hover:text-sky-300 group-hover:shadow-[0_0_15px_rgba(14,165,233,0.25)]",
    hasLink: false
  },
  {
    title: "Attach 3rd-Party Tools",
    stepNum: "Step 03",
    description: "Attach integration nodes to let your agent search the web, execute custom math, scrape content, or call third-party booking APIs.",
    icon: Cpu,
    borderClass: "hover:border-indigo-500/40",
    shadowClass: "hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.2)]",
    glowClass: "from-indigo-500/5",
    iconClass: "bg-indigo-950/20 border-indigo-900/40 text-indigo-400 group-hover:border-indigo-500/40 group-hover:text-indigo-300 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.25)]",
    hasLink: false
  },
  {
    title: "Run Flow & View Graph",
    stepNum: "Step 04",
    description: "Click 'Run Flow' to execute your agent. Watch the graph paths light up, trace real-time execution logs, and inspect output streams.",
    icon: Database,
    borderClass: "hover:border-blue-400/40",
    shadowClass: "hover:shadow-[0_20px_40px_-15px_rgba(96,165,250,0.2)]",
    glowClass: "from-blue-400/5",
    iconClass: "bg-blue-950/15 border-blue-900/30 text-blue-300 group-hover:border-blue-400/40 group-hover:text-blue-200 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.25)]",
    hasLink: false
  }
];

export default function Home() {
  const router = useRouter()

  return (
    <div className="relative min-h-screen bg-zinc-950 text-foreground flex flex-col items-center justify-start overflow-y-auto overflow-x-hidden">
      
      {/* Background Dots Grid covering the whole homepage */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        <WavyGridBackground squareSize={3} maxOpacity={0.12} gridGap={10} height={2300} />
      </div>

      {/* Floating Capsule Navbar */}
      <Navbar />

      {/* Hero Section (Split Screen Layout to take up exactly the first page) */}
      <section id="hero" className="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-14 px-6 md:px-12 w-full max-w-7xl min-h-screen pt-24 lg:pt-20">
        
        {/* Dotted grid is global */}

        {/* Left Column: Text & CTA */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 max-w-xl relative z-10">
          <h1 
            className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-450 leading-none"
            style={{ filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.95)) drop-shadow(0 12px 28px rgba(59, 130, 246, 0.25))" }}
          >
            OpenAgent
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-lg leading-relaxed font-normal">
            The visual workspace for autonomous intelligence. Connect Gemini models, chain execution tools, and orchestrate stateful agent loops in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center lg:justify-start w-full mt-2">
            <AuroraButton
              onClick={() => router.push("/builder")}
              label="Launch Builder"
              beamColor="59, 130, 246"
              duration="4s"
            />
            <AuroraButton
              onClick={() => {
                const element = document.getElementById("features")
                if (element) element.scrollIntoView({ behavior: "smooth" })
              }}
              label="Explore Features"
              variant="inverted"
              beamColor="14, 165, 233"
              duration="6s"
            />
          </div>
        </div>

        {/* Right Column: Laptop Mockup Containing Interactive Screen */}
        <div className="flex-1 w-full max-w-2xl relative select-none z-10 lg:translate-x-10 transition-transform duration-300">
          {/* Subtle glow behind the laptop */}
          <div className="absolute -inset-1 rounded-[30px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl opacity-55 z-0" />
          <div className="relative z-10 w-full flex items-center justify-center">
            <LaptopMockup scale={0.92} className="my-0 w-full">
              <ProjectPreview />
            </LaptopMockup>
          </div>
        </div>
      </section>

      {/* Main sections container */}
      <div className="w-full flex flex-col items-center relative z-10 border-t border-zinc-900">
        
        {/* Features/Capabilities Section (Flowchart Sequential Layout) */}
        <section id="features" className="relative z-10 w-full max-w-6xl px-6 md:px-8 py-8 flex flex-col gap-6 select-none">
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Platform Core</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Platform Capabilities
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-xl">
              Everything you need to design, inspect, and deploy optimized agentic workflows on a responsive visual workspace.
            </p>
            <button
              onClick={() => router.push("/features")}
              className="mt-1 text-[11px] font-bold text-blue-405 hover:text-blue-400 flex items-center gap-1 transition-colors cursor-pointer w-fit"
            >
              Read Technical Documentation <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Compact 4-Column Flowchart Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">
            {agentSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={step.title} 
                  className={`relative group bg-zinc-900/35 hover:bg-zinc-900/50 border border-zinc-800/80 ${step.borderClass} rounded-2xl p-5.5 flex flex-col gap-4 transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden hover:-translate-y-2 ${step.shadowClass}`}
                >
                  {/* Colored bottom glow overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-t ${step.glowClass} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0`} />
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
                  
                  {/* Flowchart Connector line between cards */}
                  {index < 3 && (
                    <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-3.5 w-7 items-center justify-center z-10 pointer-events-none">
                      <svg className="w-full h-2 text-blue-500/30" fill="none" viewBox="0 0 28 8">
                        <path d="M0 4H24M24 4L20 1M24 4L20 7" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3,3" strokeLinecap="round" />
                      </svg>
                    </div>
                  )}

                  <div className="flex justify-between items-center z-10">
                    <div className={`p-2.5 rounded-xl transition-all shadow-inner ${step.iconClass}`}>
                      <Icon className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-[9px] font-black text-blue-500/60 uppercase tracking-widest font-mono">{step.stepNum}</span>
                  </div>
                  
                  <div className="flex flex-col gap-1 z-10 text-left">
                    <h3 className="text-sm font-bold text-white transition-colors">{step.title}</h3>
                    <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                      {step.description}
                    </p>
                  </div>
                  
                  {step.hasLink && (
                    <button
                      onClick={() => router.push("/builder")}
                      className="mt-auto pt-2 text-[10px] font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer w-fit z-10"
                    >
                      Open Builder <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Pipeline / Under-The-Hood Architecture Section */}
        <section className="relative z-10 w-full max-w-6xl px-6 md:px-8 py-8 flex flex-col gap-6 select-none border-t border-zinc-900/60 mt-4">
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Technical Pipeline</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Under-the-Hood Architecture
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-xl">
              OpenAgent maps visual workflows into standard JSON arrays to execute models and APIs deterministically without user code.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-stretch w-full mt-2">
            
            {/* Interactive Mock Code Editor showing Arrays */}
            <div className="flex-1 bg-zinc-950/70 border border-zinc-900/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col min-h-[300px] text-left">
              {/* Editor Tabs bar */}
              <div className="bg-zinc-950/90 border-b border-zinc-900/80 px-4 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500/60" />
                  <span className="w-2 h-2 rounded-full bg-yellow-500/60" />
                  <span className="w-2 h-2 rounded-full bg-green-500/60" />
                </div>
                <div className="text-[9.5px] font-mono font-bold text-zinc-500 tracking-wider">
                  workspace_config.json
                </div>
                <div className="w-8" />
              </div>

              {/* Code Content */}
              <div className="p-5 font-mono text-[10px] md:text-[11px] leading-relaxed text-zinc-400 overflow-x-auto flex-1 flex flex-col justify-center">
                <div>
                  <span className="text-blue-400">{"{"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">&quot;nodes&quot;</span>: <span className="text-blue-400">[</span>
                </div>
                {/* Node 1 */}
                <div className="pl-8 text-zinc-500">
                  <span className="text-blue-400">{"{"}</span> <span className="text-zinc-400">&quot;id&quot;</span>: <span className="text-emerald-400">&quot;input-query&quot;</span>, <span className="text-zinc-400">&quot;type&quot;</span>: <span className="text-emerald-400">&quot;input&quot;</span> <span className="text-blue-400">{"}"}</span>,
                </div>
                {/* Node 2 */}
                <div className="pl-8 text-zinc-500">
                  <span className="text-blue-400">{"{"}</span> <span className="text-zinc-400">&quot;id&quot;</span>: <span className="text-emerald-400">&quot;gemini-llm&quot;</span>, <span className="text-zinc-400">&quot;type&quot;</span>: <span className="text-emerald-400">&quot;llm&quot;</span>, <span className="text-zinc-400">&quot;apiKey&quot;</span>: <span className="text-blue-300">&quot;{"{{YOUR_KEY}}"}&quot;</span> <span className="text-blue-400">{"}"}</span>,
                </div>
                {/* Node 3 */}
                <div className="pl-8 text-zinc-500">
                  <span className="text-blue-400">{"{"}</span> <span className="text-zinc-400">&quot;id&quot;</span>: <span className="text-emerald-400">&quot;goibibo-api&quot;</span>, <span className="text-zinc-400">&quot;type&quot;</span>: <span className="text-emerald-400">&quot;api&quot;</span>, <span className="text-zinc-400">&quot;params&quot;</span>: <span className="text-blue-400">{"{"}</span> <span className="text-zinc-400">&quot;source&quot;</span>: <span className="text-sky-300">&quot;{"{{from}}"}&quot;</span> <span className="text-blue-400">{"}"}</span> <span className="text-blue-400">{"}"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">]</span>,
                </div>
                <div className="pl-4">
                  <span className="text-sky-400">&quot;edges&quot;</span>: <span className="text-blue-400">[</span>
                </div>
                <div className="pl-8 text-zinc-500">
                  <span className="text-blue-400">{"{"}</span> <span className="text-zinc-400">&quot;source&quot;</span>: <span className="text-emerald-400">&quot;input-query&quot;</span>, <span className="text-zinc-400">&quot;target&quot;</span>: <span className="text-emerald-400">&quot;gemini-llm&quot;</span> <span className="text-blue-400">{"}"}</span>,
                </div>
                <div className="pl-8 text-zinc-500">
                  <span className="text-blue-400">{"{"}</span> <span className="text-zinc-400">&quot;source&quot;</span>: <span className="text-emerald-400">&quot;gemini-llm&quot;</span>, <span className="text-zinc-400">&quot;target&quot;</span>: <span className="text-emerald-400">&quot;goibibo-api&quot;</span> <span className="text-blue-400">{"}"}</span>
                </div>
                <div className="pl-4">
                  <span className="text-blue-400">]</span>
                </div>
                <div>
                  <span className="text-blue-400">{"}"}</span>
                </div>
              </div>
            </div>

            {/* Pipeline Execution Details Card */}
            <div className="flex-1 bg-zinc-900/25 border border-zinc-900 rounded-2xl p-6 flex flex-col justify-between shadow-xl text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl rounded-full pointer-events-none" />
              <div className="flex flex-col gap-4">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest font-mono">Dynamic Processing</span>
                <h3 className="text-lg font-bold text-white leading-snug pr-4">How Data Flows Sequentially</h3>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  When you run your agent, the workspace compiler sorts the connections array topologically. The input node loads search queries, the LLM extracts structured variables, and the API connector dynamically triggers custom third-party integrations (like Goibibo train search) to fulfill requests automatically.
                </p>

                <div className="border-t border-zinc-900/60 pt-4 flex flex-col gap-2.5">
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-zinc-350 font-semibold">Deterministic Execution loops</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-zinc-350 font-semibold">Context mappings via JSON memory</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-zinc-350 font-semibold">Zero server side coding required</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => router.push("/builder")}
                className="mt-6 lg:mt-0 px-4 py-2 bg-blue-950/20 hover:bg-blue-600 border border-blue-900/40 hover:border-blue-500/50 text-blue-400 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-950/10 cursor-pointer w-fit"
              >
                Try Building Flow <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative z-10 w-full max-w-5xl px-6 md:px-8 py-8 flex flex-col gap-4 mb-8 select-none">
          
          {/* Aesthetic Contact Box */}
          <div className="w-full max-w-4xl mx-auto bg-zinc-950/45 border border-zinc-900/60 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[inset_0_0_24px_rgba(59,130,246,0.03),0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(59,130,246,0.05)] backdrop-blur-md transition-all duration-300 hover:border-blue-900/40">
            {/* Subtle background glow effect */}
            <div className="absolute -top-12 -right-12 w-60 h-60 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10 items-center">
              {/* Left side info */}
              <div className="md:col-span-7 flex flex-col gap-5 text-left">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-blue-450 uppercase tracking-widest">Connect With Us</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                    Let&apos;s Build Together
                  </h2>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mt-1">
                    Have questions about OpenAgent integration, workflow configurations, or want to collaborate? Reach out to the core engineering team.
                  </p>
                </div>

                <a 
                  href="mailto:contact@openagent.ai" 
                  className="inline-flex items-center gap-3 text-zinc-300 hover:text-white text-xs font-bold transition-all bg-blue-950/20 hover:bg-blue-950/30 px-5 py-3.5 border border-blue-900/40 hover:border-blue-500/50 rounded-xl w-fit shadow-lg shadow-blue-950/20"
                >
                  <Mail className="w-4 h-4 text-blue-400" /> contact@openagent.ai
                </a>
              </div>

              {/* Divider (only on desktop) */}
              <div className="hidden md:block md:col-span-1 h-32 w-px bg-zinc-900 justify-self-center" />

              {/* Right side socials */}
              <div className="md:col-span-4 flex flex-col gap-4 text-left">
                <div className="flex flex-col gap-1">
                  <h3 className="text-sm font-bold text-white">Follow Our Work</h3>
                  <p className="text-[10.5px] text-zinc-500 leading-relaxed">
                    Stay updated with our latest agent framework releases and templates.
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center gap-2.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900/20 hover:bg-blue-950/20 px-3.5 py-2.5 rounded-xl border border-zinc-900/80 hover:border-blue-900/60 text-xs transition-all duration-300 cursor-pointer w-full group shadow-md">
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r" />
                    <svg className="w-4 h-4 fill-current relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    <span className="relative z-10">GitHub</span>
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center gap-2.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900/20 hover:bg-blue-950/20 px-3.5 py-2.5 rounded-xl border border-zinc-900/80 hover:border-blue-900/60 text-xs transition-all duration-300 cursor-pointer w-full group shadow-md">
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r" />
                    <svg className="w-4 h-4 relative z-10" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    <span className="relative z-10">Instagram</span>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="relative overflow-hidden flex items-center gap-2.5 text-zinc-400 hover:text-zinc-100 bg-zinc-900/20 hover:bg-blue-950/20 px-3.5 py-2.5 rounded-xl border border-zinc-900/80 hover:border-blue-900/60 text-xs transition-all duration-300 cursor-pointer w-full group shadow-md">
                    <div className="absolute left-0 top-2.5 bottom-2.5 w-[2px] bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300 rounded-r" />
                    <svg className="w-4 h-4 fill-current relative z-10" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/>
                    </svg>
                    <span className="relative z-10">LinkedIn</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-zinc-900 py-8 text-center text-xs text-zinc-650 bg-zinc-950">
        <p>© 2026 OpenAgent Project. All Rights are Reserved.</p>
      </footer>
    </div>
  )
}