"use client"

import Navbar from "@/components/navbar"
import ProjectPreview from "@/components/project-preview"
import AuroraButton from "@/components/aurora-button"
import LaptopMockup from "@/components/laptop-mockup"
import WavyGridBackground from "@/components/wavy-grid-background"
import { useRouter } from "next/navigation"
import { Mail, ArrowRight, Layout, Sparkles, Cpu, Database } from "lucide-react"

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
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-none bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-500">
            OpenAgent
          </h1>
          <p className="text-base md:text-lg text-zinc-400 font-medium leading-relaxed">
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
              beamColor="236, 72, 153"
              duration="8s"
            />
          </div>
        </div>

        {/* Right Column: Laptop Mockup Containing Interactive Screen */}
        <div className="flex-1 w-full max-w-2xl relative select-none z-10">
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
        
        {/* Features/Capabilities Section (Horizontal 4-Column Layout on Desktop) */}
        <section id="features" className="relative z-10 w-full max-w-6xl px-6 md:px-8 py-20 flex flex-col gap-10 select-none">
          <div className="flex flex-col gap-2 text-left">
            <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Platform Core</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Platform Capabilities
            </h2>
            <p className="text-zinc-500 text-xs md:text-sm max-w-xl">
              Everything you need to design, inspect, and deploy optimized agentic workflows on a responsive visual workspace.
            </p>
          </div>

          {/* Compact 4-Column Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* Capability 1: Visual Designer */}
            <div className="relative group bg-zinc-900/35 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-blue-500/40 rounded-2xl p-5.5 flex flex-col gap-4 transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.3)]">
              {/* Colored bottom glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-blue-500/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="p-2.5 rounded-xl bg-blue-950/20 border border-blue-900/40 text-blue-400 w-fit group-hover:border-blue-500/40 group-hover:text-blue-300 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-all z-10 shadow-inner">
                <Layout className="w-4.5 h-4.5" />
              </div>
              
              <div className="flex flex-col gap-1 z-10 text-left">
                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">Visual Designer</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  Wire up inputs, prompts, API functions, memory operations, and routing on a visual workspace with live controls.
                </p>
              </div>
              
              <button
                onClick={() => router.push("/builder")}
                className="mt-auto pt-2 text-[10px] font-black text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer w-fit z-10"
              >
                Open Builder <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Capability 2: Gemini Node */}
            <div className="relative group bg-zinc-900/35 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-purple-500/40 rounded-2xl p-5.5 flex flex-col gap-4 transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(168,85,247,0.3)]">
              {/* Colored bottom glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-purple-500/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-900/40 text-purple-400 w-fit group-hover:border-purple-500/40 group-hover:text-purple-300 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all z-10 shadow-inner">
                <Sparkles className="w-4.5 h-4.5" />
              </div>
              
              <div className="flex flex-col gap-1 z-10 text-left">
                <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">Gemini Nodes</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  Configure models (Gemini 1.5 Pro, 2.0 Flash) with custom temperature sliders, token thresholds, and variables binding.
                </p>
              </div>
            </div>

            {/* Capability 3: Active Tools */}
            <div className="relative group bg-zinc-900/35 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-amber-500/40 rounded-2xl p-5.5 flex flex-col gap-4 transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.3)]">
              {/* Colored bottom glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-amber-500/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="p-2.5 rounded-xl bg-amber-950/20 border border-amber-900/40 text-amber-400 w-fit group-hover:border-amber-500/40 group-hover:text-amber-300 group-hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all z-10 shadow-inner">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              
              <div className="flex flex-col gap-1 z-10 text-left">
                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Integration Tools</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  Run web searches on DuckDuckGo, execute math operations, scrape pages, and trigger webhooks automatically.
                </p>
              </div>
            </div>

            {/* Capability 4: Memory Loops */}
            <div className="relative group bg-zinc-900/35 hover:bg-zinc-900/50 border border-zinc-800/80 hover:border-teal-500/40 rounded-2xl p-5.5 flex flex-col gap-4 transition-all duration-500 shadow-2xl backdrop-blur-md overflow-hidden hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(13,148,136,0.3)]">
              {/* Colored bottom glow overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-teal-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" />
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-teal-500/5 blur-xl rounded-full group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
              
              <div className="p-2.5 rounded-xl bg-teal-950/20 border border-teal-900/40 text-teal-400 w-fit group-hover:border-teal-500/40 group-hover:text-teal-300 group-hover:shadow-[0_0_15px_rgba(13,148,136,0.3)] transition-all z-10 shadow-inner">
                <Database className="w-4.5 h-4.5" />
              </div>
              
              <div className="flex flex-col gap-1.5 z-10 text-left">
                <h3 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">Stateful Memory</h3>
                <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                  Load, save, or clear variables into cache memory, allowing agents to maintain context between execution loops.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="relative z-10 w-full max-w-5xl px-6 md:px-8 py-20 flex flex-col gap-10 mb-20 select-none">
          
          {/* Aesthetic Contact Box */}
          <div className="w-full max-w-4xl mx-auto bg-zinc-950/45 border border-zinc-900 rounded-3xl p-8 md:p-10 relative overflow-hidden shadow-2xl backdrop-blur-md">
            {/* Subtle background glow effect */}
            <div className="absolute -top-12 -right-12 w-60 h-60 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-60 h-60 bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 relative z-10 items-center">
              {/* Left side info */}
              <div className="md:col-span-7 flex flex-col gap-5 text-left">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Connect With Us</span>
                  <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-none">
                    Let&apos;s Build Together
                  </h2>
                  <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mt-1">
                    Have questions about OpenAgent integration, workflow configurations, or want to collaborate? Reach out to the core engineering team.
                  </p>
                </div>

                <a 
                  href="mailto:contact@openagent.ai" 
                  className="inline-flex items-center gap-3 text-zinc-300 hover:text-white text-xs font-bold transition-all bg-zinc-900/60 hover:bg-zinc-900 px-5 py-3.5 border border-zinc-850 hover:border-blue-900/40 rounded-xl w-fit shadow-lg shadow-black/20"
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
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-zinc-400 hover:text-white bg-zinc-900/30 hover:bg-zinc-900/80 px-3.5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-800 text-xs transition-colors cursor-pointer w-full">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                    </svg>
                    GitHub
                  </a>
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-zinc-400 hover:text-white bg-zinc-900/30 hover:bg-zinc-900/80 px-3.5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-800 text-xs transition-colors cursor-pointer w-full">
                    <svg className="w-4 h-4" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                    Instagram
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-zinc-400 hover:text-white bg-zinc-900/30 hover:bg-zinc-900/80 px-3.5 py-2.5 rounded-xl border border-zinc-900 hover:border-zinc-800 text-xs transition-colors cursor-pointer w-full">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-zinc-900 py-8 text-center text-xs text-zinc-600 bg-zinc-950">
        <p>© 2026 OpenAgent Project. All Rights are Reserved.</p>
      </footer>
    </div>
  )
}