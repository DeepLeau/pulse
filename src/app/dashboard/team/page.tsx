import { teamMembers, rolePermissions, TeamMember } from '@/lib/data';
import { cn } from '@/lib/utils';
import { Users, Search, Plus, Mail, MoreHorizontal, Shield, Clock, UserPlus } from 'lucide-react';

function MemberRow({ member }: { member: TeamMember }) {
  const roleColors = {
    owner: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    admin: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    member: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
    viewer: 'bg-zinc-500/5 text-zinc-500 border-zinc-500/10',
  };

  return (
    <tr className="border-b border-white/[0.04] last:border-0 hover:bg-white/[0.02] transition-colors">
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-300 font-medium shrink-0">
            {member.avatar}
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-200">{member.name}</p>
            <p className="text-xs text-zinc-500">{member.email}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={cn('px-2 py-0.5 rounded text-[11px] font-medium border', roleColors[member.role])}>
          {member.role}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5">
          {member.status === 'active' ? (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-green-400">Active</span>
            </>
          ) : (
            <>
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
              <span className="text-xs text-yellow-400">Pending</span>
            </>
          )}
        </div>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1.5 text-xs text-zinc-500">
          <Clock size={12} />
          {member.lastActive}
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/[0.06] text-zinc-600 hover:text-zinc-300 transition-colors">
          <MoreHorizontal size={14} />
        </button>
      </td>
    </tr>
  );
}

function RoleCard({ role, permissions }: { role: string; permissions: string[] }) {
  const roleColors = {
    owner: 'border-purple-500/20 bg-purple-500/5',
    admin: 'border-blue-500/20 bg-blue-500/5',
    member: 'border-zinc-500/20 bg-zinc-500/5',
    viewer: 'border-zinc-500/10 bg-zinc-500/2',
  };

  return (
    <div className={cn('border rounded-lg p-4', roleColors[role as keyof typeof roleColors] || roleColors.viewer)}>
      <div className="flex items-center gap-2 mb-3">
        <Shield size={14} className="text-zinc-400" />
        <span className="text-sm font-medium text-zinc-200 capitalize">{role}</span>
      </div>
      <ul className="space-y-1.5">
        {permissions.map((perm, i) => (
          <li key={i} className="text-xs text-zinc-500 flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-zinc-600" />
            {perm}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function TeamPage() {
  const activeCount = teamMembers.filter(m => m.status === 'active').length;
  const invitedCount = teamMembers.filter(m => m.status === 'invited').length;

  return (
    <>
      <header className="flex items-center justify-between h-14 px-6 border-b border-white/[0.06] shrink-0">
        <div>
          <h1 className="text-sm font-semibold text-zinc-100">Team</h1>
          <p className="text-xs text-zinc-500">{teamMembers.length} members</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-7 px-3 rounded-md border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] text-zinc-400 text-xs transition-colors flex items-center gap-1.5">
            <Mail size={13} />
            Invite
          </button>
          <button className="h-7 px-3 rounded-md bg-red-500 hover:bg-red-400 text-white text-xs font-medium transition-colors shadow-[0_0_12px_rgba(239,68,68,0.3)] flex items-center gap-1.5">
            <UserPlus size={13} />
            Add member
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
        {/* Status Summary */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400 font-medium">{activeCount} active</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-xs text-yellow-400 font-medium">{invitedCount} pending</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Members Table - 2 columns */}
          <div className="lg:col-span-2 bg-[#111] border border-white/[0.07] rounded-lg overflow-hidden hover:border-red-500/10 transition-colors">
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-sm font-medium text-zinc-200">Members</p>
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input 
                  placeholder="Search..."
                  className="h-7 pl-8 pr-3 rounded-md bg-[#1a1a1a] border border-white/[0.06] text-xs text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-red-500/40 w-40"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Member</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-4 py-2.5 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {teamMembers.map((member) => (
                    <MemberRow key={member.id} member={member} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Roles & Permissions - 1 column */}
          <div className="space-y-4">
            <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-1">Roles & Permissions</p>
            {Object.entries(rolePermissions).map(([role, perms]) => (
              <RoleCard key={role} role={role} permissions={perms} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
