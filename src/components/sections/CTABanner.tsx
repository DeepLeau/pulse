"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';

export function CTABanner() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-2xl mx-auto text-center flex flex-col items-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(239,68,68,0.12),transparent)]" />
          <h2 className="relative text-4xl font-semibold text-zinc-50 tracking-[-0.025em]">
            Start monitoring today
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-zinc-400 text-base max-w-md"
        >
          Join 1,200+ SREs who sleep better at night. Free plan available. No credit card required.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <Link href="/dashboard" className="h-10 px-6 rounded-md bg-red-500 hover:bg-red-400 text-white text-sm font-medium transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)] inline-flex items-center">
            Get started for free
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
