"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Bell, Sparkles } from "lucide-react"

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  // Scroll to section on home page, or go home and scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (targetId === "builder") {
      // Direct navigation to builder
      return
    }

    if (pathname !== "/") {
      // If we are not on homepage, let standard Link behavior navigate to home first
      return
    }

    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex items-center justify-center px-4 md:px-8 pointer-events-none select-none animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="w-full max-w-5xl flex items-center justify-center gap-3 md:gap-4 pointer-events-auto">
        {/* Main Capsule Navbar */}
        <div className="flex-1 h-14 bg-zinc-950/75 backdrop-blur-md border border-zinc-900/60 rounded-full px-6 flex items-center justify-between text-white shadow-2xl relative">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            {/* OpenAgent Styled SVG Logo (glowing connection nodes) */}
            <div className="flex items-center justify-center w-6 h-6 shrink-0">
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Glowing paths */}
                <path d="M6 12L12 6M12 6L18 12M12 6V18M6 12L12 18M12 18L18 12" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {/* Nodes */}
                <circle cx="12" cy="6" r="2.5" fill="#ffffff" />
                <circle cx="6" cy="12" r="2.5" fill="#93c5fd" />
                <circle cx="18" cy="12" r="2.5" fill="#3b82f6" />
                <circle cx="12" cy="18" r="2.5" fill="#1d4ed8" />
                <defs>
                  <linearGradient id="logo-grad" x1="6" y1="6" x2="18" y2="18" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#ffffff" />
                    <stop offset="0.5" stopColor="#3b82f6" />
                    <stop offset="1" stopColor="#1d4ed8" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="flex flex-col items-start leading-none gap-0.5">
              <span className="font-black text-sm md:text-base tracking-tight bg-clip-text bg-gradient-to-r from-white via-blue-200 to-blue-500 text-transparent">
                OpenAgent
              </span>
              <span className="text-[7.5px] md:text-[8px] font-black tracking-widest bg-clip-text bg-gradient-to-r from-blue-300 to-blue-600 text-transparent uppercase opacity-95">
                ~ GDG    JIIT 128
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden sm:flex items-center gap-1.5 md:gap-3 text-zinc-400 font-medium text-xs md:text-sm">
            <Link
              href="/"
              onClick={(e) => handleNavClick(e, "hero")}
              className={`py-1 px-3 rounded-full transition-all duration-300 cursor-pointer ${
                pathname === "/" 
                  ? "text-blue-400 bg-blue-950/20 border border-blue-900/40 shadow-[0_0_12px_rgba(59,130,246,0.12)] font-bold" 
                  : "hover:text-zinc-200"
              }`}
            >
              Home
            </Link>
            <Link
              href="/workshop"
              className={`py-1 px-3 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1 ${
                pathname === "/workshop" 
                  ? "text-cyan-400 bg-cyan-950/30 border border-cyan-900/50 shadow-[0_0_12px_rgba(6,182,212,0.2)] font-bold" 
                  : "hover:text-cyan-300"
              }`}
            >
              <Sparkles className="w-3 h-3 text-cyan-400" /> Workshop
            </Link>
            <Link
              href="/features"
              className={`py-1 px-3 rounded-full transition-all duration-300 cursor-pointer ${
                pathname === "/features" 
                  ? "text-blue-400 bg-blue-950/20 border border-blue-900/40 shadow-[0_0_12px_rgba(59,130,246,0.12)] font-bold" 
                  : "hover:text-zinc-200"
              }`}
            >
              Features
            </Link>
          </div>

          {/* Mobile indicator for workshop */}
          <div className="sm:hidden flex items-center gap-2">
            <Link
              href="/workshop"
              className="text-xs px-3 py-1 bg-cyan-950 border border-cyan-800 rounded-full text-cyan-300 font-bold"
            >
              Workshop
            </Link>
          </div>
        </div>

        {/* Notification Bell Button (Separate Round Capsule) */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="w-12 h-12 bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md rounded-full flex items-center justify-center relative hover:bg-zinc-900/60 transition-all text-zinc-300 hover:text-white shadow-2xl cursor-pointer"
            aria-label="Toggle notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          </button>

          {/* Dropdown for mock notifications */}
          {notificationsOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-zinc-950/95 border border-zinc-800 rounded-2xl p-4 shadow-2xl backdrop-blur-lg text-xs text-zinc-300 flex flex-col gap-3 pointer-events-auto animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                <span className="font-semibold text-zinc-200">Notifications</span>
                <span className="text-[10px] text-blue-400 bg-blue-950/10 px-2 py-0.5 rounded-full font-semibold">Active</span>
              </div>
              <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
                <div className="p-2 hover:bg-zinc-900/50 rounded-lg transition-colors border border-transparent hover:border-zinc-800/40">
                  <div className="font-semibold text-zinc-200 mb-0.5 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" /> OpenAgent Builder Live
                  </div>
                  <p className="text-[11px] text-zinc-400">Design your workflows, connect Gemini AI agents, and run live calculations directly inside the canvas panel.</p>
                  <span className="text-[9px] text-zinc-600 mt-1 block">Just now</span>
                </div>
                <div className="p-2 hover:bg-zinc-900/50 rounded-lg transition-colors border border-transparent hover:border-zinc-800/40">
                  <div className="font-semibold text-zinc-200 mb-0.5">Themed Scrollbars Active</div>
                  <p className="text-[11px] text-zinc-400">The custom blue/indigo accent scrollbar layout has been compiled and is now active across all panels.</p>
                  <span className="text-[9px] text-zinc-600 mt-1 block">5m ago</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
