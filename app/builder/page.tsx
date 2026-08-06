import Builder from '@/components/Builder'
import Navbar from '@/components/navbar'

export default function BuilderPage() {
    return (
        <div className="relative min-h-screen bg-zinc-950 text-white flex flex-col pt-38 pb-6 px-4 md:px-8 overflow-x-hidden">
            {/* Background Gridlines matching the canvas grid */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,rgba(63,63,70,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(63,63,70,0.06)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none select-none" />

            <Navbar />

            <div className="max-w-7xl mx-auto w-full flex flex-col gap-5 relative z-10">
                
                {/* Header Container */}
                <div className="flex flex-col gap-2 px-2 md:px-4 text-left">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Workflow Canvas</span>
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-300 to-blue-500">
                        OpenAgent Workflow Builder
                    </h1>
                    <p className="text-zinc-400 text-xs md:text-sm max-w-2xl leading-relaxed">
                        Drag, configure, and execute modular AI workflows with active Gemini endpoints and integrations. Double-click any node to configure its parameters.
                    </p>
                </div>

                {/* Dashboard Frame Container with Ambient Glowing backing */}
                <div className="relative rounded-2xl border border-zinc-900 bg-zinc-950/70 backdrop-blur-md overflow-hidden shadow-2xl">
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
