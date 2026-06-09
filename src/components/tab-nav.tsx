"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Connect", href: "/connect", icon: "🔗" },
  { name: "Research", href: "/research", icon: "🔍" },
  { name: "Publish", href: "/publish", icon: "📤" },
  { name: "Analytics", href: "/analytics", icon: "📊" },
];

export function TabNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-xl">🚀</span>
            <h1 className="text-lg font-semibold text-white">Bedford Creator Hub</h1>
            <span className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full ml-2">
              Prototype
            </span>
          </div>
          <nav className="flex gap-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === tab.href
                    ? "bg-white text-zinc-900"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                )}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
