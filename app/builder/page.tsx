import Builder from '@/components/Builder'
import Navbar from '@/components/navbar'

export default function BuilderPage() {
    return (
        <div className="relative min-h-screen bg-zinc-950 text-white flex flex-col pt-38 pb-6 px-4 md:px-8 overflow-x-hidden">
            {/* Background Gridlines matching the canvas grid with subtle overlay mask */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none select-none" />
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#09090b_95%)] pointer-events-none select-none" />

            <Navbar />

            <div className="max-w-7xl mx-auto w-full flex flex-col gap-5 relative z-10">
                
                {/* Header Container */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 px-2 md:px-4 text-left">
                    <div className="flex flex-col gap-2">
                        <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Workflow Canvas</span>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-300 to-blue-500">
                            OpenAgent Workflow Builder
                        </h1>
                        <p className="text-zinc-400 text-xs md:text-sm max-w-xl leading-relaxed">
                            Drag, configure, and execute modular AI workflows with active Gemini endpoints and integrations.
                        </p>
                    </div>

                    {/* Technical status panel */}
                    <div className="flex items-center gap-4 bg-zinc-900/20 border border-zinc-900 rounded-2xl px-4.5 py-2 w-fit backdrop-blur-sm shadow-xl shadow-black/10 select-none">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Engine Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10.5px] font-bold text-zinc-300">Online</span>
                            </div>
                        </div>
                        <div className="w-px h-6 bg-zinc-900" />
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-widest">Active Provider</span>
                            <span className="text-[10.5px] font-bold text-cyan-400 uppercase tracking-wider">Gemini 2.0</span>
                        </div>
                    </div>
                </div>

                {/* Desktop IDE Mock Frame Wrapper */}
                <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950/40 backdrop-blur-md overflow-hidden shadow-2xl">
                    
                    {/* Window Title Bar Chrome */}
                    <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/90 border-b border-zinc-900/80 select-none">
                        {/* Mock window buttons (Red, Yellow, Green macOS style) */}
                        <div className="flex gap-1.5 items-center">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 border border-red-700/30 hover:bg-red-400 transition-colors cursor-pointer" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-550/80 border border-yellow-700/30 hover:bg-yellow-450 transition-colors cursor-pointer" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 border border-emerald-700/30 hover:bg-emerald-400 transition-colors cursor-pointer" />
                        </div>
                        {/* Centered Title */}
                        <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            workspace_v1.0.json
                        </div>
                        {/* Right side helper info */}
                        <div className="text-[9px] font-mono font-semibold text-zinc-600 uppercase tracking-wider hidden sm:block">
                            Ctrl + S to Save
                        </div>
                    </div>

                    {/* Ambient Glowing backing */}
                    <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
                    
                    <div className="relative z-10">
                        <Builder />
                    </div>
                </div>

                {/* Footer block */}
                <footer className="w-full border-t border-zinc-900/60 py-5 text-center text-[10px] text-zinc-550 mt-2 select-none">
                    <p>© 2026 OpenAgent Project. All Rights are Reserved.</p>
                </footer>
            </div>
        </div>
    )
}
