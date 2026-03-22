"use client";

import { useState, useMemo } from 'react';
import { statusColors, type EndpointFormData, filterEndpoints, type Endpoint } from '@/lib/data';
import { useEndpointsStore } from '@/hooks/useEndpointsStore';
import { cn } from '@/lib/utils';
import { Globe, Search, Filter, Plus, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { CreateEndpointModal } from '@/components/ui/CreateEndpointModal';
import { EndpointRowMenu } from '@/components/ui/EndpointRowMenu';

const ITEMS_PER_PAGE = 8;

function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
      <p className="text-xs text-zinc-500">
        Page {currentPage} of {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
        </button>

        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={cn(
              'w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors',
              page === currentPage
                ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                : 'border border-white/10 bg-white/[0.03] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.06]'
            )}
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-7 h-7 flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 hover:text-zinc-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

function EndpointRow({
  endpoint,
  onEdit,
  onDelete,
}: {
  endpoint: Endpoint;
  onEdit: (endpoint: Endpoint) => void;
  onDelete: (endpoint: Endpoint) => void;
}) {
  const colors = statusColors[endpoint.status];

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-2 h-2 rounded-full', colors.dot, endpoint.status === 'down' && 'animate-pulse')} />
          <span className="text-sm text-zinc-200 font-medium">{endpoint.name}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <code className="text-xs text-zinc-500 font-mono">{endpoint.url}</code>
      </td>
      <td className="px-4 py-4">
        <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', colors.bg, colors.text, colors.border)}>
          {endpoint.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-mono', endpoint.latency > 300 ? 'text-yellow-400' : 'text-zinc-400')}>
            {endpoint.latency > 0 ? `${endpoint.latency}ms` : '-'}
          </span>
          <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className={cn('h-full rounded-full', endpoint.latency > 300 ? 'bg-yellow-400' : endpoint.latency === 0 ? 'bg-red-400' : 'bg-green-400')}
              style={{ width: `${Math.min(100, (endpoint.latency / 500) * 100)}%` }}
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="text-sm text-zinc-400 font-mono">{endpoint.uptime}%</span>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="text-xs text-zinc-600">{endpoint.lastCheck}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <EndpointRowMenu endpoint={endpoint} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
}

function EmptyState({ hasSearch }: { hasSearch: boolean }) {
  if (hasSearch) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
          <Search size={18} className="text-zinc-500" strokeWidth={1.5} />
        </div>
        <p className="text-sm font-medium text-zinc-300 mb-1">No endpoints found</p>
        <p className="text-sm text-zinc-600 max-w-xs">No endpoints match your search. Try a different name or URL.</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mb-4">
        <Globe size={18} className="text-zinc-500" strokeWidth={1.5} />
      </div>
      <p className="text-sm font-medium text-zinc-300 mb-1">No endpoints yet</p>
      <p className="text-sm text-zinc-600 max-w-xs">Create your first endpoint to start monitoring your services.</p>
    </div>
  );
}

function DeleteConfirmModal({
  isOpen,
  endpointName,
  onConfirm,
  onCancel,
}: {
  isOpen: boolean;
  endpointName: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111] border border-white/[0.09] rounded-xl shadow-2xl">
        <div className="px-5 py-5">
          <h3 className="text-sm font-semibold text-zinc-100 mb-2">Delete endpoint?</h3>
          <p className="text-sm text-zinc-400">
            Are you sure you want to delete <span className="text-zinc-200 font-medium">{endpointName}</span>? This action cannot be undone.
          </p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-white/[0.06]">
          <button
            onClick={onCancel}
            className="h-8 px-4 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-xs font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-8 px-4 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EndpointsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Endpoint | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { endpoints, addEndpoint, deleteEndpoint, updateEndpoint } = useEndpointsStore();

  const filteredEndpoints = useMemo(
    () => filterEndpoints(searchQuery, endpoints),
    [searchQuery, endpoints]
  );

  const totalPages = Math.max(1, Math.ceil(filteredEndpoints.length / ITEMS_PER_PAGE));

  const paginatedEndpoints = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredEndpoints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredEndpoints, currentPage]);

  const healthyCount = endpoints.filter(e => e.status === 'healthy').length;
  const degradedCount = endpoints.filter(e => e.status === 'degraded').length;
  const downCount = endpoints.filter(e => e.status === 'down').length;

  const handleCreateEndpoint = async (data: EndpointFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    if (editMode && editingEndpoint) {
      updateEndpoint(editingEndpoint.id, data);
    } else {
      addEndpoint(data);
    }
  };

  const handleEdit = (endpoint: Endpoint) => {
    setEditingEndpoint(endpoint);
    setEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (endpoint: Endpoint) => {
    setDeleteTarget(endpoint);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteEndpoint(deleteTarget.id);
      setDeleteTarget(null);
      if (currentPage > totalPages) {
        setCurrentPage(Math.max(1, totalPages));
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditMode(false);
    setEditingEndpoint(null);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Endpoints</h1>
          <p className="text-xs text-zinc-500">{endpoints.length} endpoints monitored</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-7 px-3 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)] flex items-center gap-1.5"
          >
            <Plus size={13} />
            Add endpoint
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              placeholder="Search endpoints by name or URL..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full h-8 pl-9 pr-3 rounded-md bg-[#111] border border-white/[0.08] text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/40 transition-colors"
            />
          </div>
          <button className="h-8 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <Filter size={13} />
            Filter
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-medium">{healthyCount} healthy</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">{degradedCount} degraded</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-xs text-red-400 font-medium">{downCount} down</span>
          </div>
        </div>

        {filteredEndpoints.length === 0 ? (
          <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
            <EmptyState hasSearch={searchQuery.length > 0} />
          </div>
        ) : (
          <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">URL</th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Latency</th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Uptime</th>
                    <th className="px-4 py-3 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Last Check</th>
                    <th className="px-4 py-3 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEndpoints.map((endpoint) => (
                    <EndpointRow
                      key={endpoint.id}
                      endpoint={endpoint}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>

      <CreateEndpointModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleCreateEndpoint}
        editMode={editMode}
        initialData={
          editingEndpoint
            ? {
                name: editingEndpoint.name,
                url: editingEndpoint.url,
              }
            : undefined
        }
      />

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        endpointName={deleteTarget?.name ?? ''}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
}
