import AuroraButton from "@/components/aurora-button"
import LaptopMockup from "@/components/laptop-mockup"
import WavyGridBackground from "@/components/wavy-grid-background"

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden">
      <WavyGridBackground squareSize={3} maxOpacity={0.2} gridGap={10} height={1000} />

      <div className="border-b border-foreground/10 py-4 flex items-center justify-center gap-6 text-foreground/70 fixed top-0 w-full z-20 bg-background/70 backdrop-blur-md">
        <div className="hover:text-foreground cursor-pointer font-medium transition-colors">Home</div>
        <div className="hover:text-foreground cursor-pointer font-medium transition-colors">About</div>
        <div className="hover:text-foreground cursor-pointer font-medium transition-colors">Contact Us</div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 mt-48 max-w-5xl lg:max-w-6xl w-full">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-foreground/90 leading-none">
          OpenAgent
        </h1>
        <p className="mt-6 text-lg md:text-xl text-foreground/70 font-medium">
          Make No-Code Agentic Workflows
        </p>
        <div className="mt-8 flex gap-6 items-center justify-center">
          <AuroraButton label="Get Started" beamColor="59, 130, 246" duration="4s" />
          <AuroraButton label="Learn More" variant="inverted" beamColor="236, 72, 153" duration="10s" />
        </div>
        <div className="w-full mt-12 mb-12">
          <LaptopMockup />
        </div>

      </div>
    </div>
  )
}