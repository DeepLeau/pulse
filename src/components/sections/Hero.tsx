"use client";
import { motion } from "framer-motion";
import { AnimatedTextGenerate } from "@/components/ui/AnimatedTextGenerate";
import { UnicornBackground } from "@/components/ui/UnicornBackground";

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 bg-[#0a0a0a] overflow-hidden pt-14">
      <UnicornBackground
        jsonFilePath="https://ipbkonbdobkaebffenbz.supabase.co/storage/v1/object/public/scenes/red_gradient.json"
        className="absolute inset-0 z-0 w-full h-full"
        scale={0.75}
        dpi={1.5}
      />
      
      <div className="absolute inset-0 pointer-events-none dot-grid z-0" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(249,115,22,0.08),transparent)] z-0" />
      
      <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/[0.04] text-xs text-zinc-400"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          Now in public beta
        </motion.div>
        
        <AnimatedTextGenerate
          text="Know instantly when your APIs fail."
          speed={0.4}
          mode="dark"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-base text-zinc-400 max-w-md leading-relaxed"
        >
          Real-time monitoring, anomaly detection, and instant alerts. 
          Built for SREs who need to sleep at night.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center gap-3 mt-2"
        >
          <button className="h-9 px-5 rounded-md bg-orange-500 hover:bg-orange-400 text-white text-sm font-medium transition-colors shadow-[0_0_16px_rgba(249,115,22,0.25)]">
            Get started free
          </button>
          <button className="h-9 px-5 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-sm font-medium transition-colors">
            View docs →
          </button>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="text-xs text-zinc-600"
        >
          Trusted by 1,200+ SREs · No credit card required
        </motion.p>
      </div>
    </section>
  );
}
