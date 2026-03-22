"use client";

import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Endpoint } from '@/lib/data';

interface EndpointRowMenuProps {
  endpoint: Endpoint;
  onEdit: (endpoint: Endpoint) => void;
  onDelete: (endpoint: Endpoint) => void;
}

export function EndpointRowMenu({ endpoint, onEdit, onDelete }: EndpointRowMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEdit = () => {
    setIsOpen(false);
    onEdit(endpoint);
  };

  const handleDelete = () => {
    setIsOpen(false);
    onDelete(endpoint);
  };

  return (
    <div ref={menuRef} className="relative inline-block">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-300 transition-colors"
        aria-label="Open menu"
        aria-expanded={isOpen}
      >
        <MoreHorizontal size={15} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-[#1a1a1a] border border-white/[0.09] rounded-lg shadow-xl overflow-hidden z-50 py-1">
          <button
            onClick={handleEdit}
            className="w-full flex items-center gap-2.5 px-3 h-9 text-sm text-zinc-300 hover:bg-white/[0.05] transition-colors"
          >
            <Edit size={14} strokeWidth={1.5} />
            Edit
          </button>
          <div className="h-px bg-white/[0.06] my-1" />
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2.5 px-3 h-9 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={14} strokeWidth={1.5} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
