"use client";

import { useState, useEffect } from 'react';
import { X, Globe, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EndpointFormData } from '@/lib/data';

interface CreateEndpointModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EndpointFormData) => Promise<void>;
  editMode?: boolean;
  initialData?: Partial<EndpointFormData>;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] as const;
const INTERVALS = ['30s', '60s', '5m', '15m'] as const;
const TIMEOUTS = ['5s', '10s', '30s'] as const;

export function CreateEndpointModal({
  isOpen,
  onClose,
  onSubmit,
  editMode = false,
  initialData,
}: CreateEndpointModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [method, setMethod] = useState<EndpointFormData['method']>('GET');
  const [interval, setInterval] = useState<EndpointFormData['interval']>('60s');
  const [timeout, setTimeout] = useState<EndpointFormData['timeout']>('10s');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; url?: string }>({});

  useEffect(() => {
    if (isOpen && initialData) {
      setName(initialData.name ?? '');
      setUrl(initialData.url ? `https://${initialData.url}` : '');
      setMethod(initialData.method ?? 'GET');
      setInterval(initialData.interval ?? '60s');
      setTimeout(initialData.timeout ?? '10s');
    } else if (isOpen) {
      setName('');
      setUrl('');
      setMethod('GET');
      setInterval('60s');
      setTimeout('10s');
    }
    setErrors({});
  }, [isOpen, initialData]);

  const validateForm = (): boolean => {
    const newErrors: { name?: string; url?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!/^https?:\/\//.test(url.trim())) {
      newErrors.url = 'URL must start with http:// or https://';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        url: url.trim(),
        method,
        interval,
        timeout,
      });
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111] border border-white/[0.09] rounded-xl shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Globe size={14} className="text-red-400" />
            </div>
            <h2 className="text-sm font-semibold text-zinc-100">
              {editMode ? 'Edit Endpoint' : 'Add Endpoint'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Endpoint name</label>
            <input
              type="text"
              placeholder="User Service"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
              }}
              className={cn(
                'h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border transition-colors duration-150 placeholder:text-zinc-600 focus:outline-none',
                errors.name
                  ? 'border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
                  : 'border-white/[0.08] focus:border-red-500/40 focus:ring-1 focus:ring-red-500/15'
              )}
            />
            {errors.name && (
              <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle size={11} />
                {errors.name}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">URL</label>
            <input
              type="text"
              placeholder="https://api.example.com/users"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (errors.url) setErrors((prev) => ({ ...prev, url: undefined }));
              }}
              className={cn(
                'h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border transition-colors duration-150 placeholder:text-zinc-600 focus:outline-none font-mono',
                errors.url
                  ? 'border-red-500/50 focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20'
                  : 'border-white/[0.08] focus:border-red-500/40 focus:ring-1 focus:ring-red-500/15'
              )}
            />
            {errors.url && (
              <p className="text-[11px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle size={11} />
                {errors.url}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="method-select" className="text-xs font-medium text-zinc-400">Method</label>
              <select
                id="method-select"
                value={method}
                onChange={(e) => setMethod(e.target.value as EndpointFormData['method'])}
                className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/15 transition-colors appearance-none"
              >
                {HTTP_METHODS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="interval-select" className="text-xs font-medium text-zinc-400">Interval</label>
              <select
                id="interval-select"
                value={interval}
                onChange={(e) => setInterval(e.target.value as EndpointFormData['interval'])}
                className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/15 transition-colors appearance-none"
              >
                {INTERVALS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="timeout-select" className="text-xs font-medium text-zinc-400">Timeout</label>
              <select
                id="timeout-select"
                value={timeout}
                onChange={(e) => setTimeout(e.target.value as EndpointFormData['timeout'])}
                className="h-9 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/40 focus:ring-1 focus:ring-red-500/15 transition-colors appearance-none"
              >
                {TIMEOUTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.06]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-8 px-4 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-8 px-4 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.2)] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={13} className="animate-spin" />
                  {editMode ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editMode ? 'Save changes' : 'Create endpoint'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
