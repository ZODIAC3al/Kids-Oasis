"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("dashboardPages");
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user && !token) {
      router.push(`/${locale}/login`);
      return;
    }

    const role = (user?.role || "").toLowerCase();
    if (role === "admin") {
      router.push(`/${locale}/dashboard/admin`);
    } else if (
      role === "nurseryowner" ||
      role === "academyowner" ||
      role === "owner" ||
      role === "academy_owner"
    ) {
      router.push(`/${locale}/dashboard/academy`);
    } else if (role === "teacher" || role === "serviceprovider") {
      router.push(`/${locale}/dashboard/teacher`);
    } else {
      router.push(`/${locale}/dashboard/parent`);
    }
  }, [user, token, router, locale]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface text-on-surface">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-xs font-semibold text-on-surface-variant">
          {t("routingToWorkspace")}
        </p>
      </div>
    </div>
  );
}
