"use client";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: 0,
    desc: "For solo developers testing the waters.",
    cta: "Start free",
    highlight: false,
    features: [
      "1,000 requests/min",
      "3 team members",
      "7-day retention",
      "Slack integration",
      "Email alerts",
    ],
    missing: ["AI anomaly detection", "PagerDuty", "Custom webhooks"],
  },
  {
    name: "Pro",
    price: 49,
    desc: "For teams running production APIs.",
    cta: "Start trial",
    highlight: true,
    features: [
      "10,000 requests/min",
      "Unlimited team",
      "30-day retention",
      "Slack & PagerDuty",
      "AI anomaly detection",
      "Custom webhooks",
      "Priority support",
    ],
    missing: [],
  },
];

export function Pricing() {
  return (
    <section className="py-24 px-6 bg-[#0a0a0a]">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-semibold text-zinc-100 tracking-tight">
            Simple pricing
          </h2>
          <p className="mt-3 text-zinc-500">Start free. Upgrade when you&apos;re ready.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "relative rounded-xl p-6 border flex flex-col gap-5",
                plan.highlight
                  ? "bg-[#111] border-orange-500/40 shadow-[0_0_32px_rgba(249,115,22,0.08)]"
                  : "bg-[#0d0d0d] border-white/[0.07]"
              )}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="px-3 py-0.5 rounded-full bg-orange-500 text-white text-[11px] font-medium">
                    Most popular
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-zinc-400">{plan.name}</h3>
                <div className="flex items-end gap-1 mt-1.5">
                  <span className="text-4xl font-semibold text-zinc-50 tracking-tight">
                    ${plan.price}
                  </span>
                  <span className="text-zinc-500 text-sm mb-1.5">/month</span>
                </div>
                <p className="text-sm text-zinc-500 mt-2">{plan.desc}</p>
              </div>

              <button
                className={cn(
                  "h-9 rounded-md text-sm font-medium transition-colors",
                  plan.highlight
                    ? "bg-orange-500 hover:bg-orange-400 text-white"
                    : "border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300"
                )}
              >
                {plan.cta}
              </button>

              <ul className="flex flex-col gap-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check size={13} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing?.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-zinc-600">
                    <Minus size={13} className="shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
