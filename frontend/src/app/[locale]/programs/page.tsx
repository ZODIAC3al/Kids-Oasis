"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  ArrowRight,
  Search,
  Filter,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl";
import LottieAnimation from "@/components/LottieAnimation";

interface ProgramItem {
  _id?: string;
  title: string;
  description: string;
  theme?: string;
  icon?: string;
}

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const t = useTranslations("programsPage");
  const tHome = useTranslations("home");
  const locale = useLocale();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  useEffect(() => {
    let cancelled = false;
    const fetchPrograms = async () => {
      try {
        const res = await axios.get<ProgramItem[]>(`${apiUrl}/site/programs`);
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          setPrograms(res.data);
        } else if (!cancelled) {
          setPrograms([
            {
              title: tHome("prog1Title"),
              description: tHome("prog1Desc"),
              theme: "pink",
            },
            {
              title: tHome("prog2Title"),
              description: tHome("prog2Desc"),
              theme: "sky",
            },
            {
              title: tHome("prog3Title"),
              description: tHome("prog3Desc"),
              theme: "sun",
            },
          ]);
        }
      } catch (err) {
        if (!cancelled) {
          setPrograms([
            {
              title: tHome("prog1Title"),
              description: tHome("prog1Desc"),
              theme: "pink",
            },
            {
              title: tHome("prog2Title"),
              description: tHome("prog2Desc"),
              theme: "sky",
            },
            {
              title: tHome("prog3Title"),
              description: tHome("prog3Desc"),
              theme: "sun",
            },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPrograms();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, tHome]);

  const filtered = programs.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="flex justify-center mb-3">
            <LottieAnimation animationPath="/Game asset.json" className="w-32 h-32" />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary shadow-elevation-1 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> {t("title")}
          </span>
          <h1 className="font-display text-3xl font-bold text-on-surface sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
            {t("subtitle")}
          </p>

          <div className="mt-6 flex items-center gap-3 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2.5 shadow-elevation-1">
            <Search className="h-4 w-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((prog, idx) => (
            <motion.div
              key={prog._id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="card-surface p-6 flex flex-col justify-between hover:shadow-elevation-2 transition"
            >
              <div>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/15 text-primary mb-4">
                  <BookOpen className="h-6 w-6" />
                </span>
                <h3 className="font-display text-xl font-bold text-on-surface mb-2">
                  {prog.title}
                </h3>
                <p className="text-sm text-on-surface-variant leading-relaxed mb-4">
                  {prog.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant flex items-center justify-between">
                <Button size="sm" href={`/${locale}/academies`} className="w-full justify-center">
                  {t("exploreClass")} <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
