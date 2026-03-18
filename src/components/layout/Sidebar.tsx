"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Activity, 
  AlertTriangle, 
  Settings, 
  Users,
  Globe,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Endpoints', icon: Globe, href: '/dashboard/endpoints' },
  { label: 'Incidents', icon: AlertTriangle, href: '/dashboard/incidents', badge: 2 },
  { label: 'Analytics', icon: Activity, href: '/dashboard/analytics' },
  { label: 'Team', icon: Users, href: '/dashboard/team' },
  { label: 'Notifications', icon: Bell, href: '/dashboard/notifications' },
];

const bottomItems = [
  { label: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[260px] h-screen flex flex-col bg-[#0a0a0a] border-r border-white/[0.06] shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-14 border-b border-white/[0.06]">
        <div className="w-6 h-6 rounded-md bg-red-500 flex items-center justify-center shadow-[0_0_12px_rgba(239,68,68,0.4)]">
          <span className="text-white text-xs font-bold">P</span>
        </div>
        <span className="text-sm font-semibold text-zinc-100 tracking-tight">Pulse</span>
      </div>

      {/* Workspace Switcher */}
      <div className="px-3 pt-4 pb-2">
        <button className="flex items-center gap-2 w-full px-2 py-2 rounded-md hover:bg-white/[0.04] transition-colors">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-orange-400 to-red-500 shrink-0" />
          <span className="text-xs text-zinc-300 truncate flex-1 text-left">production</span>
          <ChevronDown size={12} className="text-zinc-600" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3">
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
          <input 
            placeholder="Search..."
            className="w-full h-8 pl-8 pr-3 rounded-md bg-[#111] border border-white/[0.08] text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/40 transition-colors"
          />
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 flex flex-col gap-0.5 px-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-2.5 h-9 rounded-md text-sm transition-all duration-150',
                isActive 
                  ? 'bg-red-500/10 text-red-400 border-l-2 border-red-500 -ml-0.5 pl-3.5' 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03]'
              )}
            >
              <item.icon size={15} strokeWidth={1.5} />
              {item.label}
              {item.badge && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full bg-red-500/15 text-[10px] font-medium text-red-400">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Section */}
      <div className="px-2 py-3 border-t border-white/[0.06]">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2.5 px-2.5 h-9 rounded-md text-sm text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.03] transition-colors"
          >
            <item.icon size={15} strokeWidth={1.5} />
            {item.label}
          </Link>
        ))}
      </div>

      {/* User */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-t border-white/[0.06]">
        <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center text-[11px] text-zinc-300 font-medium shrink-0">
          JD
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-medium text-zinc-200 truncate">John Doe</span>
          <span className="text-[11px] text-zinc-500 truncate">john@acme.com</span>
        </div>
      </div>
    </aside>
  );
}
