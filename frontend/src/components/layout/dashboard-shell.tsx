"use client";

import { useState } from "react";
import type { RoleConfig } from "@/lib/nav-config";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function DashboardShell({
  config,
  ctaLabel = "New",
  title,
  tabs,
  search,
  children,
}: {
  config: RoleConfig;
  ctaLabel?: string;
  title?: string;
  tabs?: { label: string; active?: boolean }[];
  search?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        config={config}
        open={open}
        onClose={() => setOpen(false)}
        ctaLabel={ctaLabel}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          title={title}
          tabs={tabs}
          onMenu={() => setOpen(true)}
          userName={config.user.name}
          search={search}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
