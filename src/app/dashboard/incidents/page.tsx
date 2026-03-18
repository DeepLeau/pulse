import { incidentsList, incidentTimeline, statusColors } from '@/lib/data';
import { cn } from '@/lib/utils';
import { AlertTriangle, Clock, ArrowUpRight, CheckCircle2, Filter, Search, MoreHorizontal } from 'lucide-react';

function IncidentCard({ incident }: { incident: typeof incidentsList[0] }) {
  const colors = statusColors[incident.status];
  return (
    <div className="flex items-start gap-4 p-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer">
      <div className={cn('w-2.5 h-2.5 rounded-full mt-1.5', colors.dot, incident.status === 'critical' && 'animate-pulse')} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-200">{incident.endpoint}</span>
          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border', colors.bg, colors.text, colors.border)}>
            {incident.status}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mb-2">{incident.message}</p>
        <div className="flex items-center gap-3 text-[11px] text-zinc-600">
          <span className="flex items-center gap-1">
            <Clock size={10} />
            {incident.timestamp}
          </span>
          <span>Duration: {incident.duration}</span>
        </div>
      </div>
      <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-300 transition-colors">
        <MoreHorizontal size={14} />
      </button>
    </div>
  );
}

function TimelineItem({ item, isLast }: { item: typeof incidentTimeline[0]; isLast: boolean }) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="w-2 h-2 rounded-full bg-zinc-600" />
        {!isLast && <div className="w-px h-full bg-white/[0.06] mt-1" />}
      </div>
      <div className="flex-1 pb-4">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-mono text-zinc-500">{item.time}</span>
          <span className="text-xs text-zinc-600">•</span>
          <span className="text-xs text-zinc-400">{item.event}</span>
        </div>
        <p className="text-[11px] text-zinc-600">{item.user}</p>
      </div>
    </div>
  );
}

export default function IncidentsPage() {
  const criticalCount = incidentsList.filter(i => i.status === 'critical').length;
  const warningCount = incidentsList.filter(i => i.status === 'warning').length;
  const resolvedCount = incidentsList.filter(i => i.status === 'resolved').length;

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Incidents</h1>
          <p className="text-xs text-zinc-500">{incidentsList.length} incidents total</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <Filter size={13} />
            Filter
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Status Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-xs text-red-400 font-medium">{criticalCount} critical</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">{warningCount} warning</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-medium">{resolvedCount} resolved</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incidents List - 2 columns */}
          <div className="lg:col-span-2 bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-zinc-200">All Incidents</p>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {incidentsList.map((incident) => (
                <IncidentCard key={incident.id} incident={incident} />
              ))}
            </div>
          </div>

          {/* Timeline - 1 column */}
          <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <p className="text-sm font-medium text-zinc-200">Timeline</p>
              </div>
            </div>
            <div className="p-4">
              <p className="text-xs text-zinc-500 mb-4">Incident: POST /api/users</p>
              <div className="space-y-0">
                {incidentTimeline.map((item, i) => (
                  <TimelineItem key={i} item={item} isLast={i === incidentTimeline.length - 1} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
