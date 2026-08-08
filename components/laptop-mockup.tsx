"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"

interface LaptopMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  screenClassName?: string
  scale?: number
}

const LaptopMockup = React.forwardRef<HTMLDivElement, LaptopMockupProps>(
  ({ className, children, screenClassName, scale = 1, ...props }, ref) => {
    
    // Set up motion values for mouse hover tracking
    const x = useMotionValue(0.5)
    const y = useMotionValue(0.5)

    // Smooth spring parameters for fluid interactive rotation
    const springConfig = { damping: 22, stiffness: 100, mass: 0.6 }
    const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), springConfig)
    const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), springConfig)
    
    // Moving depth shadows opposite to tilt direction
    const shadowX = useSpring(useTransform(x, [0, 1], [12, -12]), springConfig)
    const shadowY = useSpring(useTransform(y, [0, 1], [20, -5]), springConfig)

    // Moving glass glare reflection overlay
    const reflectionX = useTransform(x, [0, 1], ["-35%", "50%"])

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
      const rect = event.currentTarget.getBoundingClientRect()
      const mouseX = event.clientX - rect.left
      const mouseY = event.clientY - rect.top
      x.set(mouseX / rect.width)
      y.set(mouseY / rect.height)
    }

    const handleMouseLeave = () => {
      x.set(0.5)
      y.set(0.5)
    }

    return (
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: "1500px", transformStyle: "preserve-3d" }}
        className="w-full max-w-4xl lg:max-w-5xl mx-auto shrink-0 my-4 select-none relative"
      >

        {/* 3D Moving Laptop Container */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            scale,
            transformStyle: "preserve-3d",
          }}
          className={cn(
            "relative w-full aspect-[1610/960] transition-shadow duration-300",
            className
          )}
          {...props as any}
        >
          {/* Screen Area (Translated for 3D layered depth) */}
          <div
            style={{ transform: "translateZ(8px)", transformStyle: "preserve-3d" }}
            className={cn(
              "absolute left-[9.317%] top-[0.416%] w-[81.615%] h-[89.895%] rounded-t-[1.8vw] lg:rounded-t-[28px] overflow-hidden z-20",
              "bg-[#08080a] border border-[#22222a]/80 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]",
              screenClassName
            )}
          >
            <div className="w-full h-full overflow-y-auto bg-[#08080a] relative">
              {children}
              
              {/* Dynamic Glass reflection glare overlay */}
              <motion.div 
                style={{ x: reflectionX }}
                className="absolute inset-0 z-50 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.04] to-transparent w-[160%] skew-x-[-25deg]"
              />
            </div>
          </div>

          {/* ── Laptop Chassis SVG (With Metallic Gradients and 3D Bezels) ────────────────────────────────── */}
          <svg
            style={{ transform: "translateZ(0px)" }}
            className="absolute inset-0 w-full h-full z-10 pointer-events-none drop-shadow-[0_12px_32px_rgba(0,0,0,0.65)]"
            viewBox="0 0 1610 960"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Main Lid/Screen Frame Background */}
            <path
              d="M145 40C145 17.9086 162.909 0 185 0H1429C1451.09 0 1469 17.9086 1469 40V903H145V40Z"
              fill="#111114"
              stroke="#2e2e3a"
              strokeWidth="4"
            />

            {/* Inner Bezel (Black Screen Border) */}
            <path
              d="M150 39C150 19.67 165.67 4 185 4H1429C1448.33 4 1464 19.67 1464 39V901H150V39Z"
              fill="#000000"
            />

            {/* Base/Bottom Body of Laptop (Slate Space Grey with metallic reflections) */}
            <path
              d="M0 903H1610V927C1610 945.225 1595.23 960 1577 960H33C14.7746 960 0 945.225 0 927V903Z"
              fill="url(#chassisGradient)"
            />

            {/* Trackpad / Lid Opening Notch */}
            <path
              d="M665 903H949V903C949 915.15 939.15 925 927 925H687C674.85 925 665 915.15 665 903V903Z"
              fill="#4a4a58"
            />

            {/* Hinge / Lower Bezel Shadow */}
            <path
              d="M150 867H1461V893C1461 896.866 1457.87 900 1454 900H157C153.134 900 150 896.866 150 893V867Z"
              fill="#18181e"
            />

            {/* Camera Lens */}
            <circle cx="805" cy="22" r="4" fill="#050505" />
            <circle cx="805" cy="22" r="1.5" fill="#4d4d5d" fillOpacity="0.8" />
            
            {/* Gradients definitions */}
            <defs>
              <linearGradient id="chassisGradient" x1="0" y1="903" x2="0" y2="960" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#3c3c4b" />
                <stop offset="10%" stopColor="#2c2c38" />
                <stop offset="85%" stopColor="#22222b" />
                <stop offset="100%" stopColor="#181820" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      </div>
    )
  }
)

LaptopMockup.displayName = "LaptopMockup"

export default LaptopMockup
