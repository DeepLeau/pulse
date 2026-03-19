"use client";

import { useState } from "react";
import { X, Globe, Zap, Clock, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EndpointFormData } from "@/lib/data";

// Export EndpointFormData for test imports
export type { EndpointFormData };

interface CreateEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EndpointFormData) => Promise<void>;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
const INTERVALS = ["30s", "60s", "5m", "15m"] as const;
const TIMEOUTS = ["5s", "10s", "30s"] as const;

export function CreateEndpointModal({ isOpen, onClose, onSubmit }: CreateEndpointModalProps) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState<typeof HTTP_METHODS[number]>("GET");
  const [interval, setInterval] = useState<typeof INTERVALS[number]>("60s");
  const [timeout, setTimeout] = useState<typeof TIMEOUTS[number]>("10s");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (!url.trim()) {
      setError("URL is required");
      return;
    }

    try {
      new URL(url.startsWith("http") ? url : `https://${url}`);
    } catch {
      setError("Please enter a valid URL");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ name, url, method, interval, timeout });
      setName("");
      setUrl("");
      setMethod("GET");
      setInterval("60s");
      setTimeout("10s");
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create endpoint");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#111] border border-white/[0.09] rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-sm font-semibold text-zinc-100">Create new endpoint</h2>
          <button
            onClick={onClose}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          {error && (
            <div className="flex items-start gap-2 px-3 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20">
              <AlertCircle size={14} className="text-red-400 mt-0.5 shrink-0" />
              <p className="text-xs text-red-400">{error}</p>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Endpoint name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Production API"
              className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">URL</label>
            <div className="relative">
              <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="api.example.com/v1/endpoint"
                className="h-9 pl-9 pr-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors w-full"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as typeof HTTP_METHODS[number])}
                className="h-9 px-2 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors appearance-none"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Check interval</label>
              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value as typeof INTERVALS[number])}
                className="h-9 px-2 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors appearance-none"
              >
                {INTERVALS.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-zinc-400">Timeout</label>
              <select
                value={timeout}
                onChange={(e) => setTimeout(e.target.value as typeof TIMEOUTS[number])}
                className="h-9 px-2 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors appearance-none"
              >
                {TIMEOUTS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <CheckCircle2 size={14} className="text-green-400 shrink-0" />
            <p className="text-xs text-zinc-500">
              We'll automatically start monitoring this endpoint after creation.
            </p>
          </div>
        </form>

        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={onClose}
            className="h-8 px-4 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="h-8 px-4 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.2)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
          >
            {isSubmitting && <Zap size={12} className="animate-spin" />}
            {isSubmitting ? "Creating..." : "Create endpoint"}
          </button>
        </div>
      </div>
    </div>
  );
}
