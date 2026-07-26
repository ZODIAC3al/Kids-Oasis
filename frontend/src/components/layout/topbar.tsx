"use client";

import { Bell, Globe, Menu, RefreshCcw, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/misc";
import { Avatar } from "@/components/ui/avatar";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function Topbar({
  title,
  onMenu,
  tabs,
  userName,
  search = true,
}: {
  title?: string;
  onMenu: () => void;
  tabs?: { label: string; active?: boolean }[];
  userName: string;
  search?: boolean;
}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    const segments = pathname.split("/");
    if (segments[1] === "en" || segments[1] === "ar") {
      segments[1] = nextLocale;
    } else {
      segments.unshift("", nextLocale);
    }
    router.push(segments.join("/"));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-outline-variant bg-surface/85 px-4 py-3 backdrop-blur-md sm:px-6">
      <button
        onClick={onMenu}
        className="rounded-lg p-2 text-on-surface-variant hover:bg-surface-container-low lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {title && (
        <h1 className="hidden shrink-0 font-display text-xl font-bold text-on-surface lg:block">
          {title}
        </h1>
      )}

      {tabs && (
        <nav className="hidden items-center gap-6 pl-2 lg:flex">
          {tabs.map((t) => (
            <button
              key={t.label}
              className={`relative py-1 text-sm font-medium transition ${
                t.active
                  ? "text-primary"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {t.label}
              {t.active && (
                <span className="absolute -bottom-[13px] left-0 right-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </nav>
      )}

      <div className="ml-auto flex flex-1 items-center justify-end gap-2 sm:flex-initial">
        {search && (
          <div className="relative hidden w-64 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <input
              placeholder="Search..."
              className="h-10 w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest pl-9 pr-3 text-sm placeholder:text-on-surface-variant/70 focus-visible:outline-2 focus-visible:outline-primary"
            />
          </div>
        )}
        <button
          onClick={toggleLanguage}
          aria-label="Toggle language"
          className="flex h-10 px-2.5 items-center gap-1.5 rounded-[var(--radius-control)] border border-outline-variant text-xs font-semibold text-on-surface-variant hover:bg-surface-container-low transition"
        >
          <Globe className="h-4 w-4" />
          <span>{locale === "en" ? "العربية" : "English"}</span>
        </button>
        <button className="hidden h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-outline-variant text-on-surface-variant hover:bg-surface-container-low sm:flex">
          <RefreshCcw className="h-4 w-4" />
        </button>
        <button className="relative flex h-10 w-10 items-center justify-center rounded-[var(--radius-control)] border border-outline-variant text-on-surface-variant hover:bg-surface-container-low">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-error" />
        </button>
        <ThemeToggle className="hidden sm:flex" />
        <Avatar name={userName} size={36} className="ml-1" />
      </div>
    </header>
  );
}
