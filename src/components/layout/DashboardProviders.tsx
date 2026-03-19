"use client";

import { EndpointsProvider } from "@/lib/store";

export function DashboardProviders({ children }: { children: React.ReactNode }) {
  return (
    <EndpointsProvider>
      {children}
    </EndpointsProvider>
  );
}
