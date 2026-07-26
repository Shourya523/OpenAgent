"use client";

import React, { type ReactNode, type ButtonHTMLAttributes } from "react";

interface AuroraButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: ReactNode;
  children?: ReactNode;
  duration?: string;
  className?: string;
  beamColor?: string;
  variant?: "default" | "inverted";
}

export default function AuroraButton({
  label = "Click me",
  children,
  onClick,
  duration = "4s",
  className = "",
  beamColor = "59, 130, 246",
  variant = "default",
  type = "button",
  ...props
}: AuroraButtonProps) {
  const isInverted = variant === "inverted";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center p-[2px] overflow-hidden rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer ${
        isInverted
          ? "shadow-[0_0_15px_rgba(236,72,153,0.12)] hover:shadow-[0_0_25px_rgba(236,72,153,0.25)]"
          : "shadow-[0_0_15px_rgba(59,130,246,0.2)] hover:shadow-[0_0_22px_rgba(59,130,246,0.35)]"
      } ${className}`}
      {...props}
    >
      {/* Animated Rotating Aurora Beam */}
      <span
        className="absolute inset-[-200%] animate-[spin_4s_linear_infinite] pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          animationDuration: duration,
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            transparent 74%,
            rgba(${beamColor}, 0.25) 86%,
            rgba(${beamColor}, 0.9) 97%,
            rgba(255, 255, 255, 1) 99.5%,
            transparent 100%
          )`,
        }}
      />

      {/* Inner Button Content */}
      <span
        className={`relative inline-flex items-center justify-center w-full px-7 py-3 rounded-full backdrop-blur-md transition-all duration-300 gap-2 text-base font-semibold ${
          isInverted
            ? "bg-gradient-to-b from-zinc-200 via-zinc-250 to-zinc-300 text-zinc-950 group-hover:from-zinc-100 group-hover:to-zinc-200 border border-zinc-400/30"
            : "bg-gradient-to-b from-zinc-900 via-zinc-950 to-black text-white group-hover:from-zinc-850 group-hover:to-zinc-900 border border-white/12"
        }`}
      >
        {children || label}
      </span>
    </button>
  );
}