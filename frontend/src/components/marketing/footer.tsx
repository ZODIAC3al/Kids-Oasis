"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Twitter } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();

  const sections = [
    {
      title: t("company"),
      links: [
        { label: t("aboutUs"), href: `/${locale}/about` },
        { label: t("careers"), href: `/${locale}/about` },
        { label: t("contact"), href: `/${locale}/about` },
        { label: t("blog"), href: `/${locale}/blog` },
      ],
    },
    {
      title: t("platform"),
      links: [
        { label: t("academies"), href: `/${locale}/academies` },
        { label: t("programs"), href: `/${locale}/programs` },
        { label: t("events"), href: `/${locale}/events` },
        { label: t("pricing"), href: `/${locale}/academies` },
      ],
    },
    {
      title: t("legal"),
      links: [
        { label: t("privacyPolicy"), href: "#" },
        { label: t("termsOfService"), href: "#" },
        { label: t("cookies"), href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t border-outline-variant bg-surface-container-low">
      <div className="mx-auto max-w-[1440px] px-4 py-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-transparent">
                <Image
                  src="/logo.jpg"
                  alt="Kids Oasis Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-display text-xl font-extrabold text-on-surface">
                Kids Oasis
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">
              {t("tagline")}
            </p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <span
                  key={i}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant cursor-pointer hover:bg-surface-container-high transition"
                >
                  <Icon className="h-4 w-4" />
                </span>
              ))}
            </div>
          </div>

          {sections.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-on-surface">
                {col.title}
              </p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-on-surface-variant hover:text-on-surface transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-6 sm:flex-row">
          <p className="text-xs text-on-surface-variant">
            {t("copyright")}
          </p>
          <p className="text-xs text-on-surface-variant">
            {t("madeWithCare")}
          </p>
        </div>
      </div>
    </footer>
  );
}
