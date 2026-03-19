import { Sidebar } from '@/components/layout/Sidebar';
import { DashboardProviders } from '@/components/layout/DashboardProviders';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProviders>
      <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </DashboardProviders>
  );
}
