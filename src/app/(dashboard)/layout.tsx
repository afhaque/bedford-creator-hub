"use client";

import { TabNav } from "@/components/tab-nav";
import { ModeProvider } from "@/lib/mode-context";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ModeProvider>
      <div className="flex flex-col min-h-screen">
        <TabNav />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </ModeProvider>
  );
}
