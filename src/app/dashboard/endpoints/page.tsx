import { endpointsList, statusColors } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Globe, Search, Filter, Plus, ArrowUpRight, MoreHorizontal, Trash2, Edit, RefreshCw } from 'lucide-react';

function EndpointRow({ endpoint }: { endpoint: typeof endpointsList[0] }) {
  const colors = statusColors[endpoint.status];
  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer">
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
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-300 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </td>
    </tr>
  );
}

export default function EndpointsPage() {
  const healthyCount = endpointsList.filter(e => e.status === 'healthy').length;
  const degradedCount = endpointsList.filter(e => e.status === 'degraded').length;
  const downCount = endpointsList.filter(e => e.status === 'down').length;

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Endpoints</h1>
          <p className="text-xs text-zinc-500">{endpointsList.length} endpoints monitored</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <RefreshCw size={13} />
            Refresh
          </button>
          <button className="h-7 px-3 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)] flex items-center gap-1.5">
            <Plus size={13} />
            Add endpoint
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              placeholder="Search endpoints..."
              className="w-full h-8 pl-9 pr-3 rounded-md bg-[#111] border border-white/[0.08] text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/40 transition-colors"
            />
          </div>
          <button className="h-8 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <Filter size={13} />
            Filter
          </button>
        </div>

        {/* Status Summary */}
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

        {/* Endpoints Table */}
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
                {endpointsList.map((endpoint) => (
                  <EndpointRow key={endpoint.id} endpoint={endpoint} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
