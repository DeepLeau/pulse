"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Brain, Slack, Clock, AlertTriangle, Activity } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Real-time alerts",
    description:
      "Get notified the second an endpoint slows down or returns an error. Sub-second detection, not minutes.",
    points: [
      "Sub-second detection",
      "Slack, PagerDuty, email",
      "Escalation policies",
    ],
    widget: "timeline",
  },
  {
    icon: Brain,
    title: "AI anomaly detection",
    description:
      "Our ML models learn your API patterns and flag deviations before they become incidents.",
    points: [
      "Learns your baselines",
      "Predictive alerts",
      "Reduces alert fatigue",
    ],
    widget: "score",
  },
  {
    icon: Activity,
    title: "Distributed tracing",
    description:
      "Trace requests across all your services. Find the slow database call in seconds, not hours.",
    points: [
      "Full request graphs",
      "Auto-instrumentation",
      "Performance bottlenecks",
    ],
    widget: "integrations",
  },
  {
    icon: Clock,
    title: "Historical analysis",
    description:
      "Understand trends over time. Compare latencies, error rates, and throughput across releases.",
    points: [
      "30-day retention",
      "Compare deployments",
      "Export to Datadog",
    ],
    widget: "actions",
  },
];

function TimelineWidget() {
  const items = [
    { time: "10:42:03", event: "GET /api/users - 523ms", color: "bg-orange-400" },
    { time: "10:42:05", event: "POST /api/orders - 45ms", color: "bg-green-500" },
    { time: "10:42:08", event: "GET /api/products - 1.2s", color: "bg-red-500" },
    { time: "10:42:12", event: "Alert triggered: latency spike", color: "bg-red-500" },
  ];
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setVisible((v) => (v < items.length ? v + 1 : 0)), 800);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111] p-5 shadow-sm space-y-3 min-h-[240px]">
      <p className="text-xs text-zinc-500 mb-2">Live traffic</p>
      {items.slice(0, visible).map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 text-sm"
        >
          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.color}`} />
          <span className="text-zinc-300 flex-1 truncate">{item.event}</span>
          <span className="text-zinc-500 text-xs font-mono">{item.time}</span>
        </motion.div>
      ))}
    </div>
  );
}

function ScoreWidget() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const target = 87;
    const id = setInterval(() => setScore((s) => (s < target ? s + 1 : target)), 20);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111] p-6 shadow-sm min-h-[240px]">
      <p className="text-sm text-zinc-500 mb-4">Anomaly score</p>
      <div className="text-5xl font-bold text-orange-500 mb-4">
        {score}
        <span className="text-xl">/100</span>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-orange-500 rounded-full"
          style={{ width: `${score}%` }}
          transition={{ duration: 0.075 }}
        />
      </div>
      <div className="mt-4 space-y-2">
        {[
          { l: "Latency", v: 92 },
          { l: "Error rate", v: 78 },
          { l: "Throughput", v: 85 },
        ].map(({ l, v }) => (
          <div key={l} className="flex items-center gap-3 text-xs">
            <span className="text-zinc-500 w-20">{l}</span>
            <div className="flex-1 h-1 bg-white/[0.06] rounded-full">
              <div
                className="h-full bg-orange-500/40 rounded-full"
                style={{ width: `${v}%` }}
              />
            </div>
            <span className="text-zinc-400 w-8 text-right">{v}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function IntegrationsWidget() {
  const integrations = [
    { name: "Slack", status: "connected" },
    { name: "PagerDuty", status: "connected" },
    { name: "Datadog", status: "connected" },
    { name: "GitHub", status: "pending" },
    { name: "Sentry", status: "connected" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % integrations.length), 700);
    return () => clearInterval(id);
  }, [integrations.length]);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111] p-5 shadow-sm space-y-3 min-h-[240px]">
      <p className="text-xs text-zinc-500 mb-2">Integrations</p>
      {integrations.map((int, i) => (
        <motion.div
          key={int.name}
          className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-500 ${
            i <= active
              ? "border-orange-500/20 bg-orange-500/[0.04]"
              : "border-white/[0.07] bg-white/[0.02]"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <div
            className={`w-2 h-2 rounded-full transition-colors duration-500 ${
              int.status === "connected" ? "bg-green-500" : "bg-zinc-600"
            }`}
          />
          <span className="text-sm text-zinc-300 flex-1">{int.name}</span>
          {int.status === "connected" && (
            <span className="text-xs text-green-500 font-medium">Connected</span>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function ActionsWidget() {
  const actions = [
    { action: "Latency spike detected", contact: "api/users endpoint", priority: "Critical", color: "bg-red-500/20 text-red-400" },
    { action: "Error rate > 5%", contact: "POST /checkout", priority: "Warning", color: "bg-orange-500/20 text-orange-400" },
    { action: "New deployment detected", contact: "v2.4.1", priority: "Info", color: "bg-blue-500/20 text-blue-400" },
  ];
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setShown((s) => (s < actions.length ? s + 1 : 0)), 900);
    return () => clearInterval(id);
  }, [actions.length]);

  return (
    <div className="rounded-xl border border-white/[0.07] bg-[#111] p-4 shadow-sm space-y-3 min-h-[240px]">
      <p className="text-xs text-zinc-500 mb-2">Active alerts</p>
      {actions.slice(0, shown).map((a, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-lg border border-white/[0.07] bg-white/[0.02]"
        >
          <div className="flex-1">
            <p className="text-xs font-medium text-zinc-200">{a.action}</p>
            <p className="text-[11px] text-zinc-500">{a.contact}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${a.color}`}>
            {a.priority}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

const widgetMap: Record<string, React.ReactNode> = {
  timeline: <TimelineWidget />,
  score: <ScoreWidget />,
  integrations: <IntegrationsWidget />,
  actions: <ActionsWidget />,
};

export function Features() {
  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
          <span className="inline-block px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-medium uppercase tracking-widest mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-4 text-zinc-100">
            Monitor at scale. Sleep at night.
          </h2>
          <p className="text-base opacity-60 leading-relaxed text-zinc-400">
            Production-grade API monitoring that catches issues before your users do.
          </p>
        </div>

        <div className="space-y-24 sm:space-y-32">
          {features.map((feature, index) => {
            const isReversed = index % 2 === 1;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 lg:gap-24 ${
                  isReversed ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="flex-1 space-y-6">
                  <div className="w-12 h-12 rounded-xl border border-orange-500/20 bg-orange-500/[0.06] flex items-center justify-center">
                    <feature.icon className="w-6 h-6 text-orange-400" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold tracking-tight mb-3 text-zinc-100">
                      {feature.title}
                    </h3>
                    <p className="text-base opacity-60 leading-relaxed text-zinc-400">
                      {feature.description}
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {feature.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-2 text-sm opacity-70 text-zinc-400"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1 w-full">{widgetMap[feature.widget]}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
