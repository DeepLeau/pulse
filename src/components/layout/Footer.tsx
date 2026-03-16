"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#0a0a0a] py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-5 h-5 rounded bg-orange-500 flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">P</span>
              </div>
              <span className="text-sm font-semibold text-zinc-100">Pulse</span>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-[200px]">
              API monitoring for SREs who need to sleep at night.
            </p>
          </div>
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Changelog", "Roadmap"],
            },
            {
              title: "Developers",
              links: ["Docs", "API Reference", "CLI", "Status"],
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"],
            },
          ].map(({ title, links }) => (
            <div key={title}>
              <p className="text-xs font-medium text-zinc-400 mb-3 uppercase tracking-wider">
                {title}
              </p>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-6 border-t border-white/[0.05]">
          <p className="text-xs text-zinc-600">
            © 2025 Pulse Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
