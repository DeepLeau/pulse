import { analyticsMetrics, latencyHistory, requestVolume, topEndpoints } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Activity, TrendingUp, TrendingDown, Minus, Clock, AlertCircle, Zap, BarChart3 } from 'lucide-react';

function StatCard({ label, value, delta, trend }: { label: string; value: string; delta: string; trend: 'up' | 'down' | 'neutral' }) {
  return (
    <div className="bg-[#111] border border-white/[0.10] rounded-lg p-4 hover:border-red-500/20 hover:shadow-[0_0_20px_rgba(239,68,68,0.08)] transition-all duration-300 group">
      <p className="text-xs text-zinc-500 mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <p className="text-2xl font-semibold text-zinc-100 tracking-tight group-hover:text-red-50 transition-colors">{value}</p>
        <div className={cn(
          'flex items-center gap-1 text-xs mb-1',
          trend === 'up' && 'text-green-400',
          trend === 'down' && 'text-green-400',
          trend === 'neutral' && 'text-zinc-500'
        )}>
          {trend === 'up' && <TrendingUp size={12} />}
          {trend === 'down' && <TrendingDown size={12} />}
          {trend === 'neutral' && <Minus size={12} />}
          <span>{delta}</span>
        </div>
      </div>
    </div>
  );
}

function LatencyChart() {
  const maxValue = Math.max(...latencyHistory.map(d => d.value));
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-red-400" />
          <p className="text-sm font-medium text-zinc-200">Latency (24h)</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-end gap-1 h-32">
          {latencyHistory.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-red-500/40 rounded-t hover:bg-red-500/60 transition-colors"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
              />
              <span className="text-[10px] text-zinc-600">{d.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function RequestChart() {
  const maxValue = Math.max(...requestVolume.map(d => d.value));
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-400" />
          <p className="text-sm font-medium text-zinc-200">Request Volume (M/day)</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-end gap-2 h-32">
          {requestVolume.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div 
                className="w-full bg-yellow-500/40 rounded-t hover:bg-yellow-500/60 transition-colors"
                style={{ height: `${(d.value / maxValue) * 100}%` }}
              />
              <span className="text-[10px] text-zinc-600">{d.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TopEndpointsTable() {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <BarChart3 size={14} className="text-green-400" />
          <p className="text-sm font-medium text-zinc-200">Top Endpoints</p>
        </div>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.05]">
            <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Endpoint</th>
            <th className="px-4 py-2.5 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Requests</th>
            <th className="px-4 py-2.5 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Latency</th>
            <th className="px-4 py-2.5 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Errors</th>
          </tr>
        </thead>
        <tbody>
          {topEndpoints.map((endpoint, i) => (
            <tr key={i} className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
              <td className="px-4 py-3">
                <code className="text-xs text-zinc-300 font-mono">{endpoint.name}</code>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm text-zinc-400 font-mono">{endpoint.requests}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm text-zinc-400 font-mono">{endpoint.latency}</span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className="text-sm text-green-400 font-mono">{endpoint.errors}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Analytics</h1>
          <p className="text-xs text-zinc-500">Performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="h-7 px-3 rounded-md bg-[#111] border border-white/10 text-xs text-zinc-400 focus:outline-none focus:border-red-500/40">
            <option>Last 24 hours</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {analyticsMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LatencyChart />
          <RequestChart />
        </div>

        {/* Top Endpoints */}
        <TopEndpointsTable />
      </div>
    </>
  );
}
