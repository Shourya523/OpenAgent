"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, MotionValue } from "framer-motion"

interface LaptopMockupProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  screenClassName?: string
  scale?: number
  chassisOpacity?: MotionValue<number> | number
}

const LaptopMockup = React.forwardRef<HTMLDivElement, LaptopMockupProps>(
  ({ className, children, screenClassName, scale = 1, chassisOpacity = 1, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        className={cn("relative w-full max-w-4xl lg:max-w-5xl mx-auto aspect-[1610/960] shrink-0 my-8", className)}
        {...props}
      >
        {/* Screen Area (Positioned using exact SVG percentage ratios) */}
        <div
          className={cn(
            "absolute left-[9.317%] top-[0.416%] w-[81.615%] h-[89.895%] rounded-t-[1.8vw] lg:rounded-t-[28px] overflow-hidden z-20",
            "bg-[#08080a] border border-[#22222a] shadow-2xl",
            screenClassName
          )}
        >
          <div className="w-full h-full overflow-y-auto bg-[#08080a]">
            {children}
          </div>
        </div>

        {/* ── Laptop Chassis SVG (Matching User Screenshot Color Scheme) ────────────────────────────────── */}
        <motion.svg
          style={{ opacity: chassisOpacity }}
          className="absolute inset-0 w-full h-full z-10 pointer-events-none drop-shadow-2xl"
          viewBox="0 0 1610 960"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Main Lid/Screen Frame Background */}
          <path
            d="M145 40C145 17.9086 162.909 0 185 0H1429C1451.09 0 1469 17.9086 1469 40V903H145V40Z"
            fill="#121215"
            stroke="#26262e"
            strokeWidth="3"
          />

          {/* Inner Bezel (Black Screen Border) */}
          <path
            d="M150 39C150 19.67 165.67 4 185 4H1429C1448.33 4 1464 19.67 1464 39V901H150V39Z"
            fill="#000000"
          />

          {/* Base/Bottom Body of Laptop (Slate Space Grey) */}
          <path
            d="M0 903H1610V927C1610 945.225 1595.23 960 1577 960H33C14.7746 960 0 945.225 0 927V903Z"
            fill="#343440"
          />

          {/* Trackpad / Lid Opening Notch (Lighter Slate Accent) */}
          <path
            d="M665 903H949V903C949 915.15 939.15 925 927 925H687C674.85 925 665 915.15 665 903V903Z"
            fill="#484856"
          />

          {/* Hinge / Lower Bezel Shadow */}
          <path
            d="M150 867H1461V893C1461 896.866 1457.87 900 1454 900H157C153.134 900 150 896.866 150 893V867Z"
            fill="#1c1c22"
          />

          {/* Camera Lens */}
          <circle cx="805" cy="22" r="4" fill="#000000" />
          <circle cx="805" cy="22" r="1.5" fill="#4a4a58" fillOpacity="0.6" />
        </motion.svg>
      </div>
    )
  }
)

LaptopMockup.displayName = "LaptopMockup"

export default LaptopMockup
