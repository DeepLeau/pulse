import { notificationChannels, alertRules } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Bell, Mail, MessageSquare, Smartphone, Webhook, Github, Plus, MoreHorizontal, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';

const channelIcons = {
  email: Mail,
  slack: MessageSquare,
  discord: MessageSquare,
  webhook: Webhook,
  sms: Smartphone,
};

function ChannelRow({ channel }: { channel: typeof notificationChannels[0] }) {
  const Icon = channelIcons[channel.type];
  const typeLabels = {
    email: 'Email',
    slack: 'Slack',
    discord: 'Discord',
    webhook: 'Webhook',
    sms: 'SMS',
  };

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center">
            <Icon size={14} className="text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{channel.name}</p>
            <p className="text-xs text-zinc-500 capitalize">{typeLabels[channel.type]}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={cn(
          'px-2 py-0.5 rounded text-[11px] font-medium border',
          channel.status === 'active' 
            ? 'bg-green-500/10 text-green-400 border-green-500/20' 
            : 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20'
        )}>
          {channel.status}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-zinc-400">{channel.recipients}</span>
      </td>
      <td className="px-4 py-4">
        <span className="text-xs text-zinc-500">{channel.lastTriggered}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-300 transition-colors">
            <Edit size={12} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] text-zinc-600 hover:text-red-400 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function AlertRuleCard({ rule }: { rule: typeof alertRules[0] }) {
  const severityColors = {
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-zinc-200">{rule.name}</span>
          <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border', severityColors[rule.severity])}>
            {rule.severity}
          </span>
        </div>
        <p className="text-xs text-zinc-500">{rule.condition}</p>
        <p className="text-[11px] text-zinc-600 mt-1">{rule.channels} channel{rule.channels > 1 ? 's' : ''}</p>
      </div>
      <button className="w-8 h-5 rounded-full transition-colors flex items-center">
        {rule.enabled ? (
          <ToggleRight size={20} className="text-green-400" />
        ) : (
          <ToggleLeft size={20} className="text-zinc-600" />
        )}
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const activeChannels = notificationChannels.filter(c => c.status === 'active').length;
  const enabledRules = alertRules.filter(r => r.enabled).length;

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Notifications</h1>
          <p className="text-xs text-zinc-500">Alert channels and rules</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)] flex items-center gap-1.5">
            <Plus size={13} />
            Add channel
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Status Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <Bell size={12} className="text-green-400" />
            <span className="text-xs text-green-400 font-medium">{activeChannels} active channels</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20">
            <span className="text-xs text-blue-400 font-medium">{enabledRules} rules enabled</span>
          </div>
        </div>

        {/* Notification Channels */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-red-400" />
              <p className="text-sm font-medium text-zinc-200">Notification Channels</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Channel</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Recipients</th>
                  <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Last Triggered</th>
                  <th className="px-4 py-2.5 w-20"></th>
                </tr>
              </thead>
              <tbody>
                {notificationChannels.map((channel) => (
                  <ChannelRow key={channel.id} channel={channel} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alert Rules */}
        <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell size={14} className="text-yellow-400" />
              <p className="text-sm font-medium text-zinc-200">Alert Rules</p>
            </div>
            <button className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
              <Plus size={12} />
              Add rule
            </button>
          </div>
          <div>
            {alertRules.map((rule) => (
              <AlertRuleCard key={rule.id} rule={rule} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
