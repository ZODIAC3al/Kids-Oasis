"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Globe,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Settings,
  Heart,
  BarChart3,
  Users,
  ShieldCheck,
  Calendar,
  BookOpen,
  Sun,
  Moon,
  Plus,
  Check,
  Bell,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/misc";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { logout, setCredentials } from "@/store/authSlice";
import { getSavedAccounts } from "@/lib/accountManager";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Booking Confirmed", body: "Your campus visit at Oasis Model Academy is confirmed.", unread: true, time: "10m ago" },
    { id: 2, title: "New Academy Listing", body: "Lighthouse Academy just opened admissions for Fall 2026.", unread: true, time: "2h ago" },
  ]);
  const [mounted, setMounted] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<ReturnType<typeof getSavedAccounts>>([]);

  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch();

  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
    setSavedAccounts(getSavedAccounts());
  }, [token, dropdownOpen]);

  const isAuthenticated = mounted && Boolean(token && user);

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

  const rawRole = (user?.role || "").toLowerCase();

  const getDashboardHref = () => {
    if (!user) return `/${locale}/dashboard/parent`;
    if (rawRole === "admin") return `/${locale}/dashboard/admin`;
    if (rawRole === "nurseryowner" || rawRole === "owner" || rawRole === "academyowner" || rawRole === "academy_owner")
      return `/${locale}/dashboard/academy`;
    if (rawRole === "teacher" || rawRole === "serviceprovider") return `/${locale}/dashboard/teacher`;
    return `/${locale}/dashboard/parent`;
  };

  const getRoleLabel = () => {
    if (rawRole === "admin") return tRoles("admin");
    if (rawRole === "nurseryowner" || rawRole === "owner" || rawRole === "academyowner" || rawRole === "academy_owner")
      return tRoles("partner");
    if (rawRole === "teacher" || rawRole === "serviceprovider") return tRoles("teacher");
    return tRoles("parent");
  };

  // Role-Dynamic Navigation Bar Links
  const getDynamicNavLinks = () => {
    const base = [
      { label: tNav("home"), href: "/" },
      { label: tNav("academies"), href: "/academies" },
      { label: tNav("programs"), href: "/programs" },
    ];

    if (!isAuthenticated || !user) {
      return [
        ...base,
        { label: tNav("events"), href: "/events" },
        { label: tNav("blog"), href: "/blog" },
        { label: tNav("about"), href: "/about" },
      ];
    }

    if (rawRole === "admin") {
      return [
        ...base,
        { label: tNav("adminPanel"), href: "/dashboard/admin" },
        { label: tNav("auditLogs"), href: "/dashboard/admin/audit-logs" },
        { label: tNav("moderation"), href: "/dashboard/admin?tab=moderation" },
      ];
    }

    if (rawRole === "nurseryowner" || rawRole === "owner" || rawRole === "academyowner" || rawRole === "academy_owner") {
      return [
        ...base,
        { label: tNav("academyDashboard"), href: "/dashboard/academy" },
        { label: tNav("analytics"), href: "/dashboard/academy/analytics" },
      ];
    }

    if (rawRole === "teacher" || rawRole === "serviceprovider") {
      return [
        ...base,
        { label: tNav("teacherWorkspace"), href: "/dashboard/teacher" },
        { label: tNav("classRoster"), href: "/dashboard/teacher/roster" },
      ];
    }

    // Default Parent
    return [
      ...base,
      { label: tNav("myDashboard"), href: "/dashboard/parent" },
      { label: tNav("events"), href: "/events" },
    ];
  };

  const getRoleSubLinks = () => {
    if (rawRole === "admin") {
      return [
        { label: tNav("auditLogsSecurity"), href: `/${locale}/dashboard/admin/audit-logs`, icon: ShieldCheck },
      ];
    }
    if (rawRole === "nurseryowner" || rawRole === "owner" || rawRole === "academyowner" || rawRole === "academy_owner") {
      return [
        { label: tNav("academyAnalytics"), href: `/${locale}/dashboard/academy/analytics`, icon: BarChart3 },
      ];
    }
    if (rawRole === "teacher" || rawRole === "serviceprovider") {
      return [
        { label: tNav("classRosterStudents"), href: `/${locale}/dashboard/teacher/roster`, icon: Users },
      ];
    }
    return [
      { label: tNav("myChildrenVisits"), href: `/${locale}/dashboard/parent`, icon: Heart },
    ];
  };

  const handleLogout = () => {
    dispatch(logout());
    setDropdownOpen(false);
    router.push(`/${locale}`);
  };

  const userAvatarUrl =
    user?.avatar ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop";

  const navLinks = getDynamicNavLinks();

  // Presentation-only helper: highlights the link that matches the current
  // route. Purely visual — does not affect routing, auth, or data logic.
  const isLinkActive = (href: string) => {
    const target = `/${locale}${href === "/" ? "" : href}`;
    if (href === "/") return pathname === target;
    return pathname === target || pathname.startsWith(`${target}/`);
  };

  return (
    <header className="sticky top-0 z-50 bg-transparent px-3 pt-3 sm:px-5 sm:pt-4 lg:px-8">
      {/* Floating pill container — mirrors the third reference layout:
          logo flush start, links centered, utility icons flush end */}
      <div className="mx-auto flex h-[68px] max-w-[1320px] items-center gap-2 rounded-full border border-outline-variant/70 bg-surface/90 px-3 shadow-elevation-2 backdrop-blur-md sm:gap-4 sm:px-4 lg:px-5">
        {/* Brand Logo — flush to the start edge of the pill */}
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2.5 rounded-full py-1.5 pe-2 ps-1.5 transition hover:opacity-80"
        >
          <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-transparent ring-1 ring-outline-variant/60">
            <Image
              src="/logo.jpg"
              alt="Kids Oasis Logo"
              fill
              priority
              className="object-cover"
            />
          </div>
          <span className="hidden font-display text-lg font-extrabold tracking-tight text-on-surface sm:inline">
            Kids Oasis
          </span>
        </Link>

        {/* Desktop Navigation Links — centered within the remaining space */}
        <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {navLinks.map((l, index) => {
            const active = isLinkActive(l.href);
            return (
              <Link
                key={`${l.href}-${index}`}
                href={`/${locale}${l.href === "/" ? "" : l.href}`}
                className={`rounded-full px-4 py-2 text-[14px] font-semibold tracking-wide transition ${active
                  ? "bg-primary-container/25 text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Spacer keeps icons pinned to the end edge on smaller desktop widths */}
        <div className="hidden flex-1 lg:hidden lg:flex" />

        {/* Right-side utility icons — mirrors the search / bag icon pair from
            the reference pill, repurposed for this app's language + theme
            controls, plus the existing auth actions. */}
        <div className="ms-auto hidden items-center gap-1.5 lg:flex">
          <button
            onClick={toggleLanguage}
            aria-label={locale === "en" ? "التبديل إلى العربية" : "Switch to English"}
            className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
          >
            <Globe className="h-[18px] w-[18px]" />
          </button>

          <div className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface">
            <ThemeToggle />
          </div>

          {isAuthenticated && user ? (
            <div className="relative flex items-center gap-2 ps-1.5">
              <Button href={getDashboardHref()} size="sm" className="hidden gap-1.5 rounded-full xl:flex">
                <LayoutDashboard className="h-4 w-4" /> {tNav("dashboard")}
              </Button>

              <Link
                href={getDashboardHref()}
                aria-label={tNav("dashboard")}
                className="flex h-10 w-10 items-center justify-center rounded-full text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface xl:hidden"
              >
                <LayoutDashboard className="h-[18px] w-[18px]" />
              </Link>

              {/* Notification Bell Button & Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setNotifOpen((v) => !v);
                    setDropdownOpen(false);
                  }}
                  className="relative flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant/60 text-on-surface-variant transition hover:bg-surface-container-low hover:text-on-surface"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.some((n) => n.unread) && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-error animate-pulse" />
                  )}
                </button>

                {notifOpen && (
                  <div className="absolute end-0 z-50 mt-2 w-72 rounded-[var(--radius-card)] card-surface border border-outline-variant p-3 shadow-elevation-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-outline-variant pb-2">
                      <span className="text-xs font-bold text-on-surface">Notifications</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
                        }
                        className="text-[10px] font-semibold text-primary hover:underline"
                      >
                        Mark all as read
                      </button>
                    </div>

                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2 rounded-lg text-xs transition ${
                            n.unread ? "bg-primary-container/10 border-l-2 border-primary" : "bg-transparent"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-on-surface">{n.title}</span>
                            <span className="text-[10px] text-on-surface-variant">{n.time}</span>
                          </div>
                          <p className="mt-0.5 text-[11px] text-on-surface-variant leading-tight">
                            {n.body}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* User Avatar Button & Menu Toggle */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-outline-variant p-1 transition hover:bg-surface-container-low"
                >
                  <div className="relative h-8 w-8 overflow-hidden rounded-full border border-primary/30">
                    <Image
                      src={userAvatarUrl}
                      alt={user.firstName || "User avatar"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <ChevronDown className="me-1 h-3.5 w-3.5 text-on-surface-variant" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute end-0 z-50 mt-2 w-64 rounded-[var(--radius-card)] card-surface border border-outline-variant p-2 shadow-elevation-3">
                    <div className="mb-1 border-b border-outline-variant px-3 py-2">
                      <p className="truncate text-sm font-bold text-on-surface">
                        {user.firstName} {user.lastName}
                      </p>
                      <span className="mt-0.5 inline-block rounded-full bg-primary-container/20 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {getRoleLabel()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Link
                        href={getDashboardHref()}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-surface-container-low"
                      >
                        <LayoutDashboard className="h-4 w-4 text-primary" /> {tNav("primaryWorkspace")}
                      </Link>

                      {getRoleSubLinks().map((sub) => {
                        const Icon = sub.icon;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-surface-container-low"
                          >
                            <Icon className="h-4 w-4 text-secondary" /> {sub.label}
                          </Link>
                        );
                      })}

                      <Link
                        href={`/${locale}/profile`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-on-surface transition hover:bg-surface-container-low"
                      >
                        <Settings className="h-4 w-4 text-on-surface-variant" /> {tNav("profileSettings")}
                      </Link>
                    </div>

                    {/* Multi-Account Switcher Section */}
                    <div className="mt-2 border-t border-outline-variant pt-2">
                      <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant/70 mb-1">
                        {locale === "en" ? "Switch Account" : "تبديل الحساب"}
                      </p>
                      <div className="space-y-1 max-h-36 overflow-y-auto">
                        {savedAccounts.map((acc) => {
                          const isCurrent = acc.user.email.toLowerCase() === user.email.toLowerCase();
                          return (
                            <button
                              key={acc.user.email}
                              onClick={() => {
                                if (!isCurrent) {
                                  dispatch(setCredentials({ token: acc.token, user: acc.user }));
                                  setDropdownOpen(false);
                                  router.push(`/${locale}`);
                                }
                              }}
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs text-left transition ${
                                isCurrent
                                  ? "bg-primary-container/20 text-primary font-bold"
                                  : "hover:bg-surface-container-low text-on-surface"
                              }`}
                            >
                              <div className="truncate min-w-0 pr-2">
                                <p className="truncate font-semibold">{acc.user.firstName} {acc.user.lastName}</p>
                                <span className="text-[10px] opacity-70 block truncate">{acc.user.email}</span>
                              </div>
                              {isCurrent && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          router.push(`/${locale}/login?addAccount=true`);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-1.5 mt-1 text-xs font-semibold text-primary hover:bg-primary-container/10 transition"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>{locale === "en" ? "Add Another Account" : "إضافة حساب آخر"}</span>
                      </button>
                    </div>

                    <div className="mt-2 border-t border-outline-variant pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-error transition hover:bg-error-container/20"
                      >
                        <LogOut className="h-4 w-4" /> {tNav("logout")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 ps-1.5">
              <Button variant="ghost" href={`/${locale}/login`} className="rounded-full">
                {tNav("login")}
              </Button>
              <Button href={`/${locale}/signup`} className="rounded-full">
                {tNav("joinNow")}
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? tNav("close") : tNav("menu")}
          className="ms-auto flex h-10 w-10 items-center justify-center rounded-full text-on-surface transition hover:bg-surface-container-low lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer — floats beneath the pill as its own rounded card */}
      {open && (
        <div className="mx-auto mt-2 max-w-[1320px] rounded-[28px] border border-outline-variant/70 bg-surface/95 p-4 shadow-elevation-3 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((l, idx) => {
              const active = isLinkActive(l.href);
              return (
                <Link
                  key={`${l.href}-${idx}`}
                  href={`/${locale}${l.href === "/" ? "" : l.href}`}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${active
                    ? "bg-primary-container/25 text-primary"
                    : "text-on-surface hover:bg-surface-container-low"
                    }`}
                >
                  {l.label}
                </Link>
              );
            })}
            {isAuthenticated && user && (
              <Link
                href={`/${locale}/profile`}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface-container-low"
              >
                {tNav("profileSettings")}
              </Link>
            )}
          </nav>

          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-outline-variant pt-3">
            {isAuthenticated && user ? (
              <div className="flex w-full items-center justify-between gap-2">
                <Button href={getDashboardHref()} className="flex-1 justify-center rounded-full">
                  {tNav("dashboard")}
                </Button>
                <button
                  onClick={handleLogout}
                  className="flex h-10 items-center justify-center gap-1.5 rounded-full border border-outline-variant px-4 text-xs font-semibold text-error"
                >
                  <LogOut className="h-4 w-4" />
                  {tNav("logout")}
                </button>
              </div>
            ) : (
              <div className="flex w-full items-center gap-2">
                <Button variant="outline" href={`/${locale}/login`} className="flex-1 justify-center rounded-full">
                  {tNav("login")}
                </Button>
                <Button href={`/${locale}/signup`} className="flex-1 justify-center rounded-full">
                  {tNav("joinNow")}
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="flex h-10 items-center gap-1.5 rounded-full border border-outline-variant px-3 text-xs font-semibold text-on-surface"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === "en" ? "AR" : "EN"}</span>
              </button>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}