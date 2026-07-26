"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { RoleConfig } from "@/lib/nav-config";
import { Avatar } from "@/components/ui/avatar";
import { Settings, X } from "lucide-react";

export function Sidebar({
  config,
  open,
  onClose,
  ctaLabel,
}: {
  config: RoleConfig;
  open: boolean;
  onClose: () => void;
  ctaLabel: string;
}) {
  const pathname = usePathname();
  const Brand = config.brandIcon;

  const isActive = (href: string) =>
    href === config.nav[0].href ? pathname === href : pathname.startsWith(href);

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-elevation-1">
              <Brand className="h-5 w-5" />
            </span>
            <div>
              <p className="font-display text-lg font-bold leading-tight text-on-surface">
                {config.productName}
              </p>
              <p className="text-[11px] uppercase tracking-wide text-on-surface-variant">
                {config.workspaceLabel}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-on-surface-variant hover:bg-surface-container-low lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pb-2">
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-[var(--radius-control)] bg-primary text-sm font-semibold text-on-primary shadow-elevation-1 transition hover:brightness-110">
            <span className="text-lg leading-none">+</span> {ctaLabel}
          </button>
        </div>

        <nav className="scrollbar-none flex-1 space-y-1 overflow-y-auto px-3 py-3">
          {config.nav.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary-container/12 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                )}
              >
                <span className="flex items-center gap-3">
                  <Icon className="h-[18px] w-[18px]" />
                  {item.label}
                </span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-on-primary">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {config.systemNav && (
            <div className="pt-4">
              <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">
                System
              </p>
              {config.systemNav.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-primary-container/12 text-primary"
                        : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                    )}
                  >
                    <Icon className="h-[18px] w-[18px]" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        <div className="border-t border-outline-variant p-4">
          <div className="flex items-center gap-3">
            <Avatar name={config.user.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-on-surface">
                {config.user.name}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {config.user.role}
              </p>
            </div>
            <Link
              href="#"
              className="rounded-lg p-1.5 text-on-surface-variant hover:bg-surface-container-low"
            >
              <Settings className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
