"use client";

import { useState } from "react";
import { dashboardMetrics, recentIncidents, monitoredEndpoints, statusColors, type EndpointFormData } from '@/lib/data';
import { useEndpoints } from '@/lib/store';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus, ArrowUpRight, Activity, Globe, Zap } from 'lucide-react';
import { CreateEndpointModal } from '@/components/ui/CreateEndpointModal';

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

function IncidentRow({ incident }: { incident: typeof recentIncidents[0] }) {
  const colors = statusColors[incident.status];
  return (
    <div className="flex items-center gap-4 px-4 py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer">
      <div className={cn('w-2 h-2 rounded-full', colors.dot, incident.status === 'critical' && 'animate-pulse')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-sm font-medium text-zinc-200">{incident.endpoint}</span>
          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border', colors.bg, colors.text, colors.border)}>
            {incident.status}
          </span>
        </div>
        <p className="text-xs text-zinc-500 truncate">{incident.message}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-xs text-zinc-400">{incident.timestamp}</p>
        <p className="text-[11px] text-zinc-600">{incident.duration}</p>
      </div>
    </div>
  );
}

function EndpointRow({ endpoint }: { endpoint: typeof monitoredEndpoints[0] }) {
  const colors = statusColors[endpoint.status];
  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className={cn('w-2 h-2 rounded-full', colors.dot, endpoint.status === 'down' && 'animate-pulse')} />
          <span className="text-sm text-zinc-200 font-medium">{endpoint.name}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <code className="text-xs text-zinc-500 font-mono">{endpoint.url}</code>
      </td>
      <td className="px-4 py-3">
        <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', colors.bg, colors.text, colors.border)}>
          {endpoint.status}
        </span>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-mono', endpoint.latency > 300 ? 'text-yellow-400' : 'text-zinc-400')}>
            {endpoint.latency}ms
          </span>
          <div className="w-12 h-1 rounded-full bg-white/[0.06] overflow-hidden">
            <div 
              className={cn('h-full rounded-full', endpoint.latency > 300 ? 'bg-yellow-400' : 'bg-green-400')} 
              style={{ width: `${Math.min(100, (endpoint.latency / 500) * 100)}%` }} 
            />
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-sm text-zinc-400">{endpoint.uptime}%</span>
      </td>
      <td className="px-4 py-3 text-right">
        <span className="text-xs text-zinc-600">{endpoint.lastCheck}</span>
      </td>
    </tr>
  );
}

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { endpoints, addEndpoint } = useEndpoints();
  const healthyCount = endpoints.filter(e => e.status === 'healthy').length;
  const totalEndpoints = endpoints.length;

  const handleCreateEndpoint = async (data: EndpointFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    addEndpoint(data);
  };

  return (
    <>
      {/* Page Header */}
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Overview</h1>
          <p className="text-xs text-zinc-500">production / us-east-1</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <Zap size={13} />
            Real-time
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="h-7 px-3 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)]"
          >
            + Add endpoint
          </button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {dashboardMetrics.map((metric) => (
            <StatCard key={metric.label} {...metric} />
          ))}
        </div>

        {/* Main Grid - 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Incidents - 2 columns */}
          <div className="lg:col-span-2 bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <p className="text-sm font-medium text-zinc-200">Recent Incidents</p>
              </div>
              <a href="/dashboard/incidents" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                View all <ArrowUpRight size={10} />
              </a>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {recentIncidents.map((incident) => (
                <IncidentRow key={incident.id} incident={incident} />
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-zinc-200">System Status</p>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center shadow-[0_0_12px_rgba(34,197,94,0.15)]">
                  <CheckCircle2 size={18} className="text-green-400" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-zinc-100">Operational</p>
                  <p className="text-xs text-zinc-500">All systems running normally</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Endpoints</span>
                  <span className="text-xs text-zinc-300">{healthyCount}/{totalEndpoints} healthy</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div 
                    className="h-full bg-green-400 rounded-full transition-all" 
                    style={{ width: `${(healthyCount / totalEndpoints) * 100}%` }} 
                  />
                </div>
                
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-zinc-500">Response time</span>
                  <span className="text-xs text-green-400">-12% avg</span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                  <div 
                    className="h-full bg-orange-400 rounded-full" 
                    style={{ width: '35%' }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Endpoints Table */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-red-400" />
              <p className="text-sm font-medium text-zinc-200">Monitored Endpoints</p>
            </div>
            <a href="/dashboard/endpoints" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              View all <ArrowUpRight size={10} />
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Endpoint</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">URL</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Latency</th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Uptime</th>
                  <th className="px-4 py-2.5 text-right text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Last Check</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.slice(0, 6).map((endpoint) => (
                  <EndpointRow key={endpoint.id} endpoint={endpoint} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Endpoint Modal */}
      <CreateEndpointModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEndpoint}
      />
    </>
  );
}
