import { workspaceSettings, billingInfo } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Settings, Globe, Clock, Database, CreditCard, AlertTriangle, Trash2, ExternalLink, CheckCircle2, Shield } from 'lucide-react';

function SettingRow({ label, value, description }: { label: string; value: string | React.ReactNode; description?: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-[#111] border-b border-white/[0.06] last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      {typeof value === 'string' ? (
        <input 
          defaultValue={value}
          className="h-8 px-3 rounded-md text-sm text-zinc-100 bg-[#1a1a1a] border border-white/[0.08] focus:outline-none focus:border-red-500/60 focus:ring-1 focus:ring-red-500/20 transition-colors w-48 text-right"
        />
      ) : (
        value
      )}
    </div>
  );
}

function ToggleRow({ label, description, enabled }: { label: string; description?: string; enabled: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-4 bg-[#111] border-b border-white/[0.06] last:border-0">
      <div>
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
      </div>
      <button className={cn(
        'w-10 h-5 rounded-full transition-colors relative',
        enabled ? 'bg-red-500' : 'bg-zinc-700'
      )}>
        <div className={cn(
          'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200',
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        )} />
      </button>
    </div>
  );
}

function BillingCard() {
  return (
    <div className="bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <CreditCard size={14} className="text-green-400" />
          <p className="text-sm font-medium text-zinc-200">Billing</p>
        </div>
        <span className="text-xs text-green-400">Active</span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold text-zinc-100">{billingInfo.plan}</p>
            <p className="text-xs text-zinc-500">{billingInfo.price}</p>
          </div>
          <button className="h-7 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-300 text-xs transition-colors">
            Upgrade
          </button>
        </div>
        <div className="space-y-3">
          {Object.entries(billingInfo.usage).map(([key, value]) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-zinc-500 capitalize">{key}</span>
                <span className="text-xs text-zinc-400">{value}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div 
                  className="h-full bg-red-500/60 rounded-full"
                  style={{ width: `${(parseInt(value.split('/')[0]) / parseInt(value.split('/')[1])) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-zinc-600 mt-4">Next billing: {billingInfo.nextBilling}</p>
      </div>
    </div>
  );
}

function DangerZone() {
  return (
    <div className="mt-8 border border-red-500/20 rounded-lg p-5 bg-red-500/[0.03]">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={14} className="text-red-400" />
        <h3 className="text-sm font-medium text-red-400">Danger zone</h3>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        These actions are irreversible. Please be certain.
      </p>
      <div className="flex flex-col gap-3">
        <button className="h-8 px-4 rounded-md border border-red-500/25 bg-red-500/[0.06] hover:bg-red-500/10 text-red-400 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 w-fit">
          <Trash2 size={13} />
          Delete all endpoints
        </button>
        <button className="h-8 px-4 rounded-md border border-red-500/25 bg-red-500/[0.06] hover:bg-red-500/10 text-red-400 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 w-fit">
          <Trash2 size={13} />
          Delete workspace
        </button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Settings</h1>
          <p className="text-xs text-zinc-500">Manage your workspace</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl">
          {/* General Settings */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-zinc-100 mb-1">General</h2>
            <p className="text-sm text-zinc-500 mb-4">Manage your project settings.</p>
            <div className="flex flex-col border border-white/[0.07] rounded-lg overflow-hidden">
              <SettingRow 
                label="Workspace name" 
                value={workspaceSettings.name} 
              />
              <SettingRow 
                label="Region" 
                value={workspaceSettings.region} 
              />
              <SettingRow 
                label="Timezone" 
                value={workspaceSettings.timezone} 
              />
            </div>
          </div>

          {/* Monitoring Settings */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-zinc-100 mb-1">Monitoring</h2>
            <p className="text-sm text-zinc-500 mb-4">Configure monitoring behavior.</p>
            <div className="flex flex-col border border-white/[0.07] rounded-lg overflow-hidden">
              <ToggleRow 
                label="Auto-resolve incidents" 
                description="Automatically mark incidents as resolved when endpoint recovers"
                enabled={workspaceSettings.autoResolve}
              />
              <SettingRow 
                label="Data retention" 
                value={`${workspaceSettings.retentionDays} days`} 
              />
            </div>
          </div>

          {/* Billing */}
          <div className="mb-8">
            <h2 className="text-base font-semibold text-zinc-100 mb-1">Billing</h2>
            <p className="text-sm text-zinc-500 mb-4">Manage your subscription.</p>
            <BillingCard />
          </div>

          {/* Danger Zone */}
          <DangerZone />
        </div>
      </div>
    </>
  );
}
