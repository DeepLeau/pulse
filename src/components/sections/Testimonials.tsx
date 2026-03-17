"use client";
import { AnimatedCanopy } from "@/components/ui/AnimatedCanopy";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote:
      "Pulse caught a latency spike in production 30 seconds after deploy. Saved us from a major incident.",
    name: "Sarah Chen",
    role: "Staff SRE @ Vercel",
  },
  {
    id: 2,
    quote:
      "The AI anomaly detection is scary good. It flagged an issue before we even noticed.",
    name: "Marcus Johnson",
    role: "Platform Lead @ Linear",
  },
  {
    id: 3,
    quote:
      "Finally, API monitoring that doesn't require a PhD to configure. Set up in 5 minutes.",
    name: "Alex Rivera",
    role: "Backend Eng @ Supabase",
  },
  {
    id: 4,
    quote:
      "The distributed tracing saved us hours of debugging. Found the slow query instantly.",
    name: "Emma Watson",
    role: "SRE @ Railway",
  },
  {
    id: 5,
    quote:
      "Our on-call nights are peaceful now. Pulse handles the alerts, we handle the sleep.",
    name: "David Kim",
    role: "CTO @ Trigger.dev",
  },
  {
    id: 6,
    quote:
      "Best developer experience I've seen in monitoring tools. The docs are actually readable.",
    name: "Jordan Lee",
    role: "Principal Engineer @ Turso",
  },
];

function TestimonialCard({
  quote,
  name,
  role,
}: {
  quote: string;
  name: string;
  role: string;
}) {
  return (
    <div className="flex-shrink-0 w-80 p-5 rounded-xl border border-white/[0.07] bg-[#111] flex flex-col gap-3">
      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3">
        &quot;{quote}&quot;
      </p>
      <div className="mt-auto">
        <p className="text-xs font-medium text-zinc-200">{name}</p>
        <p className="text-[11px] text-zinc-500">{role}</p>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-24 overflow-hidden bg-[#0a0a0a] border-t border-white/[0.06]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16 px-6"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-400 text-sm font-medium mb-4">
          Testimonials
        </span>
        <h2 className="text-3xl sm:text-4xl font-semibold text-zinc-100 tracking-tight">
          Loved by SREs
        </h2>
      </motion.div>

      <div className="relative flex flex-col gap-4">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10" />

        <AnimatedCanopy reverse={false} pauseOnHover>
          {testimonials.map((t) => (
            <TestimonialCard key={t.id} {...t} />
          ))}
        </AnimatedCanopy>

        <AnimatedCanopy reverse={true} pauseOnHover>
          {testimonials.map((t) => (
            <TestimonialCard key={`b-${t.id}`} {...t} />
          ))}
        </AnimatedCanopy>

        <AnimatedCanopy reverse={false} pauseOnHover>
          {testimonials.map((t) => (
            <TestimonialCard key={`c-${t.id}`} {...t} />
          ))}
        </AnimatedCanopy>
      </div>
    </section>
  );
}
