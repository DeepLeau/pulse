"use client";

import { useState, useRef, useEffect, forwardRef } from "react";
import { Globe, Link2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EndpointFormData } from "@/lib/data";

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

    if (!isOpen) return null;

    return (
      <div
        ref={ref}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleBackdropClick}
      >
        <div
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
                Create endpoint
              </h2>
            </div>
            <button
              aria-label="Close modal"
              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors disabled:opacity-40"
              onClick={onClose}
              disabled={isSubmitting}
            >
              <X size={15} />
            </button>
          </div>

          {/* Form */}
          <form
            className="px-5 py-5 flex flex-col gap-4"
            onSubmit={handleSubmit}
          >
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="endpoint-name"
                className="text-xs font-medium text-zinc-400"
              >
                Name
              </label>
              <input
                ref={nameInputRef}
                id="endpoint-name"
                type="text"
                placeholder="Production API"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: undefined });
                }}
                className={cn(
                  "h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border transition-colors duration-150 placeholder:text-zinc-600 focus:outline-none focus:ring-1",
                  errors.name
                    ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
                    : "border-white/[0.08] focus:border-red-500/50 focus:ring-red-500/15"
                )}
              />
              {errors.name && (
                <span className="text-xs text-red-400">{errors.name}</span>
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
                  value={url}
                  onChange={(e) => {
                    setUrl(e.target.value);
                    if (errors.url) setErrors({ ...errors, url: undefined });
                  }}
                  className={cn(
                    "w-full h-9 pl-9 pr-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border transition-colors duration-150 placeholder:text-zinc-600 focus:outline-none focus:ring-1",
                    errors.url
                      ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
                      : "border-white/[0.08] focus:border-red-500/50 focus:ring-red-500/15"
                  )}
                />
              </div>
              {errors.url && (
                <span className="text-xs text-red-400">{errors.url}</span>
              )}
            </div>

            {/* Method & Interval Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="endpoint-method"
                  className="text-xs font-medium text-zinc-400"
                >
                  Method
                </label>
                <select
                  id="endpoint-method"
                  value={method}
                  onChange={(e) =>
                    setMethod(e.target.value as EndpointFormData["method"])
                  }
                  className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border border-white/[0.08] focus:outline-none focus:border-red-500/50 focus:ring-red-500/15 transition-colors"
                >
                  <option value="GET">GET</option>
                  <option value="POST">POST</option>
                  <option value="PUT">PUT</option>
                  <option value="DELETE">DELETE</option>
                  <option value="PATCH">PATCH</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="endpoint-interval"
                  className="text-xs font-medium text-zinc-400"
                >
                  Interval
                </label>
                <select
                  id="endpoint-interval"
                  value={interval}
                  onChange={(e) =>
                    setInterval(e.target.value as EndpointFormData["interval"])
                  }
                  className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border border-white/[0.08] focus:outline-none focus:border-red-500/50 focus:ring-red-500/15 transition-colors"
                >
                  <option value="30s">30s</option>
                  <option value="60s">60s</option>
                  <option value="5m">5m</option>
                  <option value="15m">15m</option>
                </select>
              </div>
            </div>

            {/* Timeout */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="endpoint-timeout"
                className="text-xs font-medium text-zinc-400"
              >
                Timeout
              </label>
              <select
                id="endpoint-timeout"
                value={timeout}
                onChange={(e) =>
                  setTimeout(e.target.value as EndpointFormData["timeout"])
                }
                className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#0a0a0a] border border-white/[0.08] focus:outline-none focus:border-red-500/50 focus:ring-red-500/15 transition-colors"
              >
                <option value="5s">5s</option>
                <option value="10s">10s</option>
                <option value="30s">30s</option>
              </select>
            </div>

            {/* Success Message */}
            {isSuccess && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-green-500/10 border border-green-500/20">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-xs text-green-400">
                  Endpoint created successfully
                </span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || isSuccess}
              className="h-9 mt-1 rounded-md bg-red-500 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium transition-colors"
            >
              {isSubmitting ? "Creating..." : isSuccess ? "Created!" : "Create endpoint"}
            </button>
          </form>
        </div>
      </div>
    );
  }
);
