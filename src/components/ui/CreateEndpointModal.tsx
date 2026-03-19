"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EndpointFormData } from "@/lib/data";

const MotionDiv = motion.div;

interface CreateEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EndpointFormData) => Promise<void>;
}

export const CreateEndpointModal = forwardRef<HTMLDivElement, CreateEndpointModalProps>(
  function CreateEndpointModal({ isOpen, onClose, onSubmit }, ref) {
    const [name, setName] = useState("");
    const [url, setUrl] = useState("");
    const [method, setMethod] = useState<EndpointFormData["method"]>("GET");
    const [interval, setInterval] = useState<EndpointFormData["interval"]>("60s");
    const [timeout, setTimeout] = useState<EndpointFormData["timeout"]>("10s");
    const [errors, setErrors] = useState<{ name?: string; url?: string }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const nameInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (isOpen) {
        nameInputRef.current?.focus();
      }
    }, [isOpen]);

    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape" && isOpen) {
          onClose();
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    const validate = (): boolean => {
      const newErrors: { name?: string; url?: string } = {};
      if (!name.trim()) {
        newErrors.name = "Name is required";
      }
      if (!url.trim()) {
        newErrors.url = "URL is required";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;

      setIsSubmitting(true);
      try {
        await onSubmit({
          name: name.trim(),
          url: url.trim(),
          method,
          interval,
          timeout,
        });
        setIsSuccess(true);
        setTimeout(() => {
          setName("");
          setUrl("");
          setMethod("GET");
          setInterval("60s");
          setTimeout("10s");
          setIsSuccess(false);
          onClose();
        }, 1500);
      } catch (error) {
        console.error("Failed to create endpoint:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    return (
      <AnimatePresence>
        {isOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
          >
            <MotionDiv
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-[#111] border border-white/[0.09] rounded-xl shadow-2xl overflow-hidden"
              role="dialog"
              aria-labelledby="modal-title"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                    <Globe size={13} className="text-red-400" />
                  </div>
                  <h2
                    id="modal-title"
                    className="text-sm font-semibold text-zinc-100"
                  >
                    Add Endpoint
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-label="Close modal"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
                {/* Name Field */}
                <div className="flex flex-col gap-1.5">
                  <label
                    htmlFor="endpoint-name"
                    className="text-xs font-medium text-zinc-400"
                  >
                    Endpoint Name
                  </label>
                  <input
                    id="endpoint-name"
                    ref={nameInputRef}
                    type="text"
                    placeholder="User Service"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={cn(
                      "h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border",
                      errors.name
                        ? "border-red-500/50 focus:border-red-500/60"
                        : "border-white/[0.08] focus:border-red-500/40",
                      "placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/15 transition-colors duration-150"
                    )}
                  />
                  {errors.name && (
                    <p className="text-[11px] text-red-400">{errors.name}</p>
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
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                    />
                    <input
                      id="endpoint-url"
                      type="text"
                      placeholder="https://api.example.com/users"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className={cn(
                        "w-full h-9 pl-9 pr-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border",
                        errors.url
                          ? "border-red-500/50 focus:border-red-500/60"
                          : "border-white/[0.08] focus:border-red-500/40",
                        "placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-red-500/15 transition-colors duration-150"
                      )}
                    />
                  </div>
                  {errors.url && (
                    <p className="text-[11px] text-red-400">{errors.url}</p>
                  )}
                </div>

                {/* Method & Interval Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">
                      Method
                    </label>
                    <select
                      value={method}
                      onChange={(e) =>
                        setMethod(e.target.value as EndpointFormData["method"])
                      }
                      className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border border-white/[0.08] focus:outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/15 transition-colors appearance-none"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                      <option value="PATCH">PATCH</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400">
                      Check Interval
                    </label>
                    <select
                      value={interval}
                      onChange={(e) =>
                        setInterval(
                          e.target.value as EndpointFormData["interval"]
                        )
                      }
                      className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border border-white/[0.08] focus:outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/15 transition-colors appearance-none"
                    >
                      <option value="30s">Every 30s</option>
                      <option value="60s">Every 1m</option>
                      <option value="5m">Every 5m</option>
                      <option value="15m">Every 15m</option>
                    </select>
                  </div>
                </div>

                {/* Timeout Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-zinc-400">
                    Timeout
                  </label>
                  <select
                    value={timeout}
                    onChange={(e) =>
                      setTimeout(e.target.value as EndpointFormData["timeout"])
                    }
                    className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border border-white/[0.08] focus:outline-none focus:border-red-500/40 focus:ring-2 focus:ring-red-500/15 transition-colors appearance-none"
                  >
                    <option value="5s">5 seconds</option>
                    <option value="10s">10 seconds</option>
                    <option value="30s">30 seconds</option>
                  </select>
                </div>

                {/* Submit Button */}
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-8 px-4 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-xs font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      "h-8 px-4 rounded-md text-xs font-medium transition-colors flex items-center gap-2",
                      isSuccess
                        ? "bg-green-500 text-white"
                        : "bg-red-500 hover:bg-red-400 text-white shadow-[0_0_12px_rgba(239,68,68,0.3)]",
                      isSubmitting && "opacity-80 cursor-not-allowed"
                    )}
                  >
                    {isSubmitting && (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    {isSuccess ? "Added!" : "Add Endpoint"}
                  </button>
                </div>
              </form>
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>
    );
  }
);
CreateEndpointModal.displayName = "CreateEndpointModal";
