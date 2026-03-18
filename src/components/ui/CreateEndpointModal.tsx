"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Check, AlertCircle, Globe, Link2, Timer, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EndpointFormData {
  name: string;
  url: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  interval: "30s" | "60s" | "5m" | "15m";
  timeout: "5s" | "10s" | "30s";
}

interface FieldError {
  name?: string;
  url?: string;
}

type ModalState = "idle" | "loading" | "success" | "error";

interface CreateEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EndpointFormData) => Promise<void>;
}

const HTTP_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"] as const;
const INTERVALS = [
  { value: "30s", label: "30 seconds" },
  { value: "60s", label: "1 minute" },
  { value: "5m", label: "5 minutes" },
  { value: "15m", label: "15 minutes" },
] as const;
const TIMEOUTS = [
  { value: "5s", label: "5 seconds" },
  { value: "10s", label: "10 seconds" },
  { value: "30s", label: "30 seconds" },
] as const;

const METHOD_COLORS: Record<string, string> = {
  GET: "text-green-400 bg-green-500/10 border-green-500/20",
  POST: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  PUT: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  DELETE: "text-red-400 bg-red-500/10 border-red-500/20",
  PATCH: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

function validateForm(data: Partial<EndpointFormData>): FieldError {
  const errors: FieldError = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  } else if (data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.url?.trim()) {
    errors.url = "URL is required";
  } else {
    try {
      const url = new URL(data.url);
      if (!["http:", "https:"].includes(url.protocol)) {
        errors.url = "URL must use HTTP or HTTPS protocol";
      }
    } catch {
      errors.url = "Please enter a valid URL";
    }
  }

  return errors;
}

export function CreateEndpointModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateEndpointModalProps) {
  const [formData, setFormData] = useState<EndpointFormData>({
    name: "",
    url: "",
    method: "GET",
    interval: "60s",
    timeout: "10s",
  });
  const [errors, setErrors] = useState<FieldError>({});
  const [state, setState] = useState<ModalState>("idle");
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const handleClose = useCallback(() => {
    if (state === "loading") return;
    setFormData({
      name: "",
      url: "",
      method: "GET",
      interval: "60s",
      timeout: "10s",
    });
    setErrors({});
    setTouched({});
    setState("idle");
    onClose();
  }, [state, onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const fieldErrors = validateForm(formData);
    setErrors(fieldErrors);
  };

  const handleChange = (field: keyof EndpointFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      const fieldErrors = validateForm({ ...formData, [field]: value });
      setErrors(fieldErrors);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validateForm(formData);
    setErrors(fieldErrors);
    setTouched({ name: true, url: true });

    if (Object.keys(fieldErrors).length > 0) {
      return;
    }

    setState("loading");
    try {
      await onSubmit(formData);
      setState("success");
      setTimeout(handleClose, 1200);
    } catch {
      setState("error");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleBackdropClick}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full max-w-md bg-[#111] border border-white/[0.09] rounded-xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <Globe size={13} className="text-red-400" />
                </div>
                <h2 id="modal-title" className="text-sm font-semibold text-zinc-100">
                  Create endpoint
                </h2>
              </div>
              <button
                onClick={handleClose}
                disabled={state === "loading"}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40"
                aria-label="Close modal"
              >
                <X size={15} />
              </button>
            </div>

            {/* Success State */}
            {state === "success" && (
              <div className="flex flex-col items-center justify-center py-12 px-5">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="w-12 h-12 rounded-full bg-green-500/15 border border-green-500/25 flex items-center justify-center mb-4"
                >
                  <Check size={20} className="text-green-400" />
                </motion.div>
                <p className="text-sm font-medium text-zinc-100">
                  Endpoint created successfully
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Your endpoint is now being monitored
                </p>
              </div>
            )}

            {/* Form */}
            {state !== "success" && (
              <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
                {/* Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="endpoint-name"
                    className="text-xs font-medium text-zinc-400"
                  >
                    Name
                  </label>
                  <input
                    ref={firstInputRef}
                    id="endpoint-name"
                    type="text"
                    placeholder="Production API"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    onBlur={() => handleFieldBlur("name")}
                    disabled={state === "loading"}
                    className={cn(
                      "h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border transition-colors duration-150 placeholder:text-zinc-600 focus:outline-none focus:ring-1",
                      errors.name && touched.name
                        ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                        : "border-white/[0.08] focus:border-red-500/50 focus:ring-red-500/15",
                      state === "loading" && "opacity-50 cursor-not-allowed"
                    )}
                  />
                  {errors.name && touched.name && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle size={10} />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* URL Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="endpoint-url"
                    className="text-xs font-medium text-zinc-400"
                  >
                    URL
                  </label>
                  <div className="relative">
                    <Link2
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <input
                      id="endpoint-url"
                      type="text"
                      placeholder="https://api.example.com/health"
                      value={formData.url}
                      onChange={(e) => handleChange("url", e.target.value)}
                      onBlur={() => handleFieldBlur("url")}
                      disabled={state === "loading"}
                      className={cn(
                        "w-full h-9 pl-9 pr-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border transition-colors duration-150 placeholder:text-zinc-600 focus:outline-none focus:ring-1",
                        errors.url && touched.url
                          ? "border-red-500/50 focus:border-red-500/60 focus:ring-red-500/20"
                          : "border-white/[0.08] focus:border-red-500/50 focus:ring-red-500/15",
                        state === "loading" && "opacity-50 cursor-not-allowed"
                      )}
                    />
                  </div>
                  {errors.url && touched.url && (
                    <p className="text-[11px] text-red-400 flex items-center gap-1">
                      <AlertCircle size={10} />
                      {errors.url}
                    </p>
                  )}
                </div>

                {/* Method + Interval Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="endpoint-method"
                      className="text-xs font-medium text-zinc-400"
                    >
                      Method
                    </label>
                    <div className="relative">
                      <select
                        id="endpoint-method"
                        value={formData.method}
                        onChange={(e) =>
                          handleChange("method", e.target.value)
                        }
                        disabled={state === "loading"}
                        className={cn(
                          "w-full h-9 px-3 pr-8 rounded-md text-sm bg-[#0a0a0a] border border-white/[0.08] text-zinc-100 appearance-none focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/15 transition-colors duration-150 cursor-pointer",
                          state === "loading" && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {HTTP_METHODS.map((method) => (
                          <option key={method} value={method}>
                            {method}
                          </option>
                        ))}
                      </select>
                      <RefreshCw
                        size={11}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 rotate-90 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor="endpoint-interval"
                      className="text-xs font-medium text-zinc-400"
                    >
                      Check interval
                    </label>
                    <div className="relative">
                      <select
                        id="endpoint-interval"
                        value={formData.interval}
                        onChange={(e) =>
                          handleChange("interval", e.target.value)
                        }
                        disabled={state === "loading"}
                        className={cn(
                          "w-full h-9 px-3 pr-8 rounded-md text-sm bg-[#0a0a0a] border border-white/[0.08] text-zinc-100 appearance-none focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/15 transition-colors duration-150 cursor-pointer",
                          state === "loading" && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {INTERVALS.map((interval) => (
                          <option key={interval.value} value={interval.value}>
                            {interval.label}
                          </option>
                        ))}
                      </select>
                      <RefreshCw
                        size={11}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Timeout Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="endpoint-timeout"
                    className="text-xs font-medium text-zinc-400"
                  >
                    Timeout
                  </label>
                  <div className="relative">
                    <Timer
                      size={13}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                    />
                    <select
                      id="endpoint-timeout"
                      value={formData.timeout}
                      onChange={(e) => handleChange("timeout", e.target.value)}
                      disabled={state === "loading"}
                      className={cn(
                        "w-full h-9 pl-9 pr-8 rounded-md text-sm bg-[#0a0a0a] border border-white/[0.08] text-zinc-100 appearance-none focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/15 transition-colors duration-150 cursor-pointer",
                        state === "loading" && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {TIMEOUTS.map((timeout) => (
                        <option key={timeout.value} value={timeout.value}>
                          {timeout.label}
                        </option>
                      ))}
                    </select>
                    <RefreshCw
                      size={11}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 rotate-90 pointer-events-none"
                    />
                  </div>
                </div>

                {/* Preview Badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] text-zinc-600">Preview:</span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-medium border",
                      METHOD_COLORS[formData.method]
                    )}
                  >
                    {formData.method}
                  </span>
                  <code className="text-[11px] text-zinc-500 font-mono truncate">
                    {formData.url || "your-url.com"}
                  </code>
                </div>

                {/* Error Message */}
                {state === "error" && (
                  <div className="flex items-start gap-2 px-3 py-2.5 rounded-md bg-red-500/10 border border-red-500/20">
                    <AlertCircle
                      size={14}
                      className="text-red-400 mt-0.5 shrink-0"
                    />
                    <div>
                      <p className="text-xs font-medium text-red-400">
                        Failed to create endpoint
                      </p>
                      <p className="text-[11px] text-red-400/70 mt-0.5">
                        Please check your connection and try again.
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06] -mx-5 px-5 -mb-1">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={state === "loading"}
                    className="h-8 px-4 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-xs font-medium transition-colors disabled:opacity-40"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="h-8 px-4 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)] disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
                  >
                    {state === "loading" && (
                      <>
                        <Loader2 size={12} className="animate-spin" />
                        Creating...
                      </>
                    )}
                    {state !== "loading" && "Create endpoint"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
