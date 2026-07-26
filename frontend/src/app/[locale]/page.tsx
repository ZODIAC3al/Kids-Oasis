"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, animate, useScroll, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  ArrowRight,
  MapPin,
  ShieldCheck,
  Headphones,
  GraduationCap,
  Building2,
  Star,
  BookOpen,
  Palette,
  Award,
  Newspaper,
  Calendar,
  HelpCircle,
  ChevronDown,
  Mail,
  Send,
  CheckCircle2,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KidsPlayingAnimation } from "@/components/ui/kids-playing";
import { useTranslations, useLocale } from "next-intl";

/* ------------------------------------------------------------------ */
/* Types — replaces the previous `any` state so bad/partial API        */
/* responses fail typechecking instead of blowing up at render time.   */
/* All fields are optional except the ones every card actually         */
/* requires, since the API and the static fallbacks don't share an     */
/* identical shape.                                                    */
/* ------------------------------------------------------------------ */
interface SiteHero {
  eyebrow?: string;
  title?: string;
  description?: string;
}

interface SiteData {
  hero?: SiteHero;
}

interface Academy {
  _id?: string;
  id?: string;
  name: string;
  location?: string;
  address?: string;
  rating?: number;
  totalReviews?: number;
  reviews?: number;
  price?: number;
  logo?: string;
  image?: string;
  activities?: string[];
  tags?: string[];
}

interface Program {
  title?: string;
  description?: string;
  theme?: string;
}

interface Testimonial {
  quote: string;
  name: string;
  role?: string;
}

interface NewsItem {
  _id?: string;
  id?: string;
  title: string;
  excerpt?: string;
  summary?: string;
  image?: string;
  cover?: string;
  date?: string;
  publishedAt?: string;
  category?: string;
}

export default function HomePage() {
  const tHero = useTranslations("hero");
  const tCat = useTranslations("categories");
  const tAcad = useTranslations("academies");
  const tHome = useTranslations("home");
  const locale = useLocale();

  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [academiesList, setAcademiesList] = useState<Academy[]>([]);
  const [programsList, setProgramsList] = useState<Program[]>([]);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

  // Animated scroll progress bar
  const { scrollYProgress } = useScroll();
  const scrollProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      try {
        const [siteRes, academiesRes, programsRes, newsRes, testimonialsRes] = await Promise.allSettled([
          axios.get(`${apiUrl}/site/info`),
          axios.get(`${apiUrl}/academies`),
          axios.get(`${apiUrl}/site/programs`),
          axios.get(`${apiUrl}/site/news`),
          axios.get(`${apiUrl}/site/testimonials`),
        ]);

        if (cancelled) return;

        if (siteRes.status === "fulfilled") setSiteData(siteRes.value.data);
        if (academiesRes.status === "fulfilled" && Array.isArray(academiesRes.value.data)) {
          setAcademiesList(academiesRes.value.data);
        }
        if (programsRes.status === "fulfilled" && Array.isArray(programsRes.value.data)) {
          setProgramsList(programsRes.value.data);
        }
        if (newsRes.status === "fulfilled" && Array.isArray(newsRes.value.data)) {
          setNewsList(newsRes.value.data);
        }
        if (testimonialsRes.status === "fulfilled" && Array.isArray(testimonialsRes.value.data)) {
          setTestimonialsList(testimonialsRes.value.data);
        }
      } catch (err) {
        console.error("Error fetching homepage dynamic data:", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const heroStats = [
    { target: 1204, label: tHero("verifiedCount"), format: (n: number) => Math.round(n).toLocaleString() },
    { target: 24.5, label: tHero("familiesCount"), format: (n: number) => `${n.toFixed(1)}k` },
    { target: 4.9, label: tHero("ratingCount"), format: (n: number) => n.toFixed(1) },
  ];

  const fallbackNews: NewsItem[] = [
    {
      id: "fallback-1",
      title: "5 Signs Your Child Is Ready for a Structured Preschool Program",
      excerpt:
        "The early academic and social cues that suggest a child may be ready to thrive in a classroom setting.",
      date: "2026-06-02",
      category: "Parenting Tips",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "fallback-2",
      title: "How Verified Reviews Keep Academies Accountable",
      excerpt: "A look at how facilities are screened and how honest feedback from real families reaches you.",
      date: "2026-05-18",
      category: "Platform Updates",
      image: "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
    },
    {
      id: "fallback-3",
      title: "STEM Play at Home: Simple Activities for Ages 3-6",
      excerpt: "A few low-cost weekend activities that extend what kids are already learning in the classroom.",
      date: "2026-04-27",
      category: "Learning",
      image: "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=1200&auto=format&fit=crop",
    },
  ];

  const newsToRender = newsList.length > 0 ? newsList : fallbackNews;

  const trustBadges = [
    { icon: ShieldCheck, label: "Background-Checked Staff" },
    { icon: Award, label: "NAEYC-Aligned Curriculum" },
    { icon: Palette, label: "Play-Based Learning" },
    { icon: MapPin, label: "Nationwide Coverage" },
    { icon: Headphones, label: "24/7 Parent Support" },
  ];

  const howItWorksSteps = [
    {
      icon: Search,
      title: "Search & Compare",
      description: "Filter academies by location, curriculum style, price, and verified parent ratings.",
    },
    {
      icon: Calendar,
      title: "Book a Tour",
      description: "Schedule an in-person or virtual visit directly through an academy's profile.",
    },
    {
      icon: ShieldCheck,
      title: "Enroll Securely",
      description: "Handle paperwork and payment through one protected, trackable checkout flow.",
    },
    {
      icon: CheckCircle2,
      title: "Track Progress",
      description: "Get updates, attendance, and milestones from your dashboard once enrolled.",
    },
  ];

  const faqItems = [
    {
      question: "How do you verify academies and nurseries on the platform?",
      answer:
        "Every listed academy goes through a licensing and background-check review before it can accept bookings, and we periodically re-verify active listings.",
    },
    {
      question: "Can I change or cancel an enrollment after booking?",
      answer:
        "Yes — each academy sets its own cancellation window, which is shown clearly on the listing and again before you confirm checkout.",
    },
    {
      question: "Is my payment information secure?",
      answer:
        "Payments are processed through an encrypted, PCI-compliant provider — Kids Oasis never stores your full card details.",
    },
    {
      question: "Do you support academies outside major cities?",
      answer:
        "Coverage is expanding steadily beyond metro areas — use the search filters on the Academies page to check what's available near you.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      {/* Animated scroll progress indicator */}
      <motion.div
        style={{ scaleX: scrollProgress }}
        className="fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-primary"
      />

      <Navbar />
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_100%_at_50%_-10%,var(--primary-container)_0%,var(--surface)_55%)] opacity-[0.16]" />
          <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-2 lg:px-10 lg:pb-24 lg:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary shadow-elevation-1">
                <GraduationCap className="h-3.5 w-3.5" /> {siteData?.hero?.eyebrow || tHero("badge")}
              </span>
              <h1 className="mt-6 font-display text-[40px] font-bold leading-[1.05] tracking-tight text-on-surface sm:text-[52px] lg:text-[60px]">
                {siteData?.hero?.title || `${tHero("titleLine1")} ${tHero("titleLine2")} ${tHero("titleLine3")}`}
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-on-surface-variant">
                {siteData?.hero?.description || tHero("subtitle")}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" href={`/${locale}/academies`}>
                  {tHero("ctaPrimary")} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" href={`/${locale}/academies`}>
                  {tHero("ctaSecondary")}
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap gap-8">
                {heroStats.map((stat) => (
                  <AnimatedStat key={stat.label} target={stat.target} label={stat.label} format={stat.format} />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full aspect-[4/3] max-h-[480px] flex items-center justify-center">
                <KidsPlayingAnimation />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="glass absolute -left-4 top-8 hidden w-52 rounded-2xl p-4 shadow-elevation-2 sm:block lg:-left-10"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-tertiary-container/20 text-tertiary">
                    <ShieldCheck className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-on-surface">
                      {tHome("naeycAccredited")}
                    </p>
                    <p className="text-[11px] text-on-surface-variant">
                      {tHome("verifiedFacilitiesOnly")}
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
                className="glass absolute -bottom-6 right-2 w-56 rounded-2xl p-4 shadow-elevation-2 sm:-right-8"
              >
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-on-surface">
                  {tHome("heroTestimonial")}
                </p>
                <p className="mt-1.5 text-[11px] font-semibold text-on-surface-variant">
                  {tHome("heroAuthor")}
                </p>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* TRUST BADGES — new, animated marquee */}
        <section className="border-y border-outline-variant/60 bg-surface-container-lowest/60 py-6 overflow-hidden">
          <motion.div
            className="flex w-max gap-10 px-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 24, ease: "linear", repeat: Infinity }}
          >
            {[...trustBadges, ...trustBadges].map((badge, idx) => {
              const Icon = badge.icon;
              return (
                <div
                  key={`${badge.label}-${idx}`}
                  className="flex shrink-0 items-center gap-2 text-sm font-semibold text-on-surface-variant"
                >
                  <Icon className="h-4 w-4 text-primary" />
                  {badge.label}
                </div>
              );
            })}
          </motion.div>
        </section>

        {/* EDUCATIONAL PROGRAMS SECTION */}
        <section className="bg-surface-container-low/50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                  {tCat("title")}
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {tCat("subtitle")}
                </p>
              </div>
              <Link
                href={`/${locale}/programs`}
                className="hidden text-sm font-semibold text-primary hover:underline sm:block"
              >
                {tHome("exploreAllPrograms")}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {(programsList.length > 0 ? programsList : [
                { title: tHome("prog1Title"), description: tHome("prog1Desc"), theme: "pink" },
                { title: tHome("prog2Title"), description: tHome("prog2Desc"), theme: "sky" },
                { title: tHome("prog3Title"), description: tHome("prog3Desc"), theme: "sun" }
              ]).map((prog, idx) => (
                <motion.div
                  key={prog.title || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="card-surface p-6 flex flex-col justify-between transition hover:shadow-elevation-2"
                >
                  <div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/15 text-primary mb-4">
                      <BookOpen className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-xl font-bold text-on-surface">
                      {prog.title}
                    </h3>
                    <p className="mt-2 text-sm text-on-surface-variant leading-relaxed">
                      {prog.description}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-outline-variant flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {tHome("interactiveCurriculum")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-primary" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED ACADEMIES SECTION */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                  {tAcad("title")}
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  {tAcad("subtitle")}
                </p>
              </div>
              <Link
                href={`/${locale}/academies`}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {tHome("exploreAll")}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {(academiesList.length > 0 ? academiesList : [
                {
                  id: "1",
                  name: tHome("acad1Name"),
                  location: tHome("acad1Loc"),
                  rating: 4.9,
                  totalReviews: 128,
                  price: 1450,
                  logo: "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
                  activities: [tHome("tagStemFocus"), tHome("tagTransportation")],
                },
                {
                  id: "2",
                  name: tHome("acad2Name"),
                  location: tHome("acad2Loc"),
                  rating: 4.7,
                  totalReviews: 84,
                  price: 950,
                  logo: "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=1200&auto=format&fit=crop",
                  activities: [tHome("tagOutdoorFocus"), tHome("tagOrganicMeals")],
                },
                {
                  id: "3",
                  name: tHome("acad3Name"),
                  location: tHome("acad3Loc"),
                  rating: 5.0,
                  totalReviews: 210,
                  price: 1200,
                  logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
                  activities: [tHome("tagMontessori"), tHome("tagLanguageImmersion")],
                },
              ]).map((acad, idx) => (
                <motion.div
                  key={acad._id || acad.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  viewport={{ once: true }}
                  className="card-surface group flex flex-col overflow-hidden transition duration-200 hover:shadow-elevation-2"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden">
                    <Image
                      src={acad.logo || acad.image || "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop"}
                      alt={acad.name || "Academy"}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute right-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-xs font-semibold text-on-surface backdrop-blur-md">
                      ★ {acad.rating || 4.8} ({acad.totalReviews || acad.reviews || 95})
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-bold text-on-surface">
                      {acad.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-on-surface-variant">
                      <MapPin className="h-3.5 w-3.5 shrink-0" /> {acad.location || acad.address || "San Francisco, CA"}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(acad.activities || acad.tags || [tHome("tagStemFocus"), "NAEYC"]).map((t: string) => (
                        <span
                          key={t}
                          className="rounded-full bg-surface-container-high px-2 py-0.5 text-[11px] font-medium text-on-surface-variant"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-outline-variant pt-4">
                      <div>
                        <span className="font-display text-lg font-bold text-primary">
                          ${acad.price || 1450}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {tAcad("perMonth")}
                        </span>
                      </div>
                      <Button size="sm" href={`/${locale}/academies/${acad._id || acad.id}`}>
                        {tAcad("viewDetails")}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS — new */}
        <section className="bg-surface-container-low/50 py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                How Kids Oasis Works
              </h2>
              <p className="mx-auto mt-2 max-w-xl text-sm text-on-surface-variant">
                From search to enrollment, every step happens in one place.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {howItWorksSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="card-surface relative p-6"
                  >
                    <span className="absolute right-5 top-5 font-display text-3xl font-extrabold text-on-surface/5">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/15 text-primary">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-4 font-display text-lg font-bold text-on-surface">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                      {step.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <section className="bg-surface-container-low/30 py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl text-center">
              {tHome("testimonialsTitle")}
            </h2>
            <p className="mt-2 text-sm text-on-surface-variant text-center max-w-xl mx-auto">
              {tHome("testimonialsSubtitle")}
            </p>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {(testimonialsList.length > 0 ? testimonialsList : [
                { quote: tHome("quote1"), name: tHome("author1"), role: tHome("role1") },
                { quote: tHome("quote2"), name: tHome("author2"), role: tHome("role2") },
                { quote: tHome("quote3"), name: tHome("author3"), role: tHome("role3") },
              ]).map((t, idx) => (
                <motion.div
                  key={t.name || idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="card-surface p-6 flex flex-col justify-between"
                >
                  <p className="text-sm leading-relaxed text-on-surface-variant italic">
                    "{t.quote}"
                  </p>
                  <div className="mt-6 pt-4 border-t border-outline-variant flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary-container/20 flex items-center justify-center font-bold text-primary">
                      {(t.name || "?").charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{t.name}</p>
                      <p className="text-xs text-on-surface-variant">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* LATEST NEWS / BLOG — new; wires up the previously-unused newsList fetch */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                  Latest From Our Blog
                </h2>
                <p className="mt-2 text-sm text-on-surface-variant">
                  Guidance, platform updates, and ideas from the Kids Oasis team.
                </p>
              </div>
              <Link
                href={`/${locale}/blog`}
                className="hidden text-sm font-semibold text-primary hover:underline sm:block"
              >
                Read all articles
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {newsToRender.map((item, idx) => {
                const rawDate = item.date || item.publishedAt;
                let formattedDate = "";
                if (rawDate) {
                  try {
                    formattedDate = new Intl.DateTimeFormat(locale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(rawDate));
                  } catch {
                    formattedDate = rawDate;
                  }
                }

                return (
                  <motion.article
                    key={item._id || item.id || idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    transition={{ duration: 0.35, delay: idx * 0.08 }}
                    viewport={{ once: true }}
                    className="card-surface flex flex-col overflow-hidden transition hover:shadow-elevation-2"
                  >
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={item.image || item.cover || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      {item.category && (
                        <span className="absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-1 text-[11px] font-semibold text-primary backdrop-blur-md">
                          {item.category}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {formattedDate && (
                        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                          <Calendar className="h-3.5 w-3.5" /> {formattedDate}
                        </div>
                      )}
                      <h3 className="mt-2 font-display text-base font-bold leading-snug text-on-surface">
                        {item.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-on-surface-variant">
                        {item.excerpt || item.summary}
                      </p>
                      <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-primary">
                        <Newspaper className="h-3.5 w-3.5" /> Read more
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ — new */}
        <section className="bg-surface-container-low/50 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-10">
            <div className="text-center">
              <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                Frequently Asked Questions
              </h2>
              <p className="mt-2 text-sm text-on-surface-variant">
                Can't find what you're looking for? Reach out through the contact page.
              </p>
            </div>

            <div className="mt-10 space-y-3">
              {faqItems.map((item, idx) => (
                <FaqItem key={item.question} question={item.question} answer={item.answer} defaultOpen={idx === 0} />
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER — new, self-contained form */}
        <NewsletterSection apiUrl={apiUrl} />

        {/* FINAL CTA — new */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
              className="card-surface flex flex-col items-center gap-6 p-10 text-center shadow-elevation-2 sm:p-14"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-elevation-1">
                <GraduationCap className="h-6 w-6" />
              </span>
              <h2 className="max-w-xl font-display text-2xl font-bold text-on-surface sm:text-3xl">
                Ready to find the right place for your child?
              </h2>
              <p className="max-w-lg text-sm text-on-surface-variant">
                Browse verified academies near you and book a tour in minutes.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button size="lg" href={`/${locale}/academies`}>
                  {tHero("ctaPrimary")} <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" href={`/${locale}/signup`}>
                  Create a free account
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* AnimatedStat — counts up from 0 to its target once it scrolls into  */
/* view. Purely presentational; the underlying label/value data still  */
/* comes from the same translation calls as before.                    */
/* ------------------------------------------------------------------ */
function AnimatedStat({
  target,
  label,
  format,
}: {
  target: number;
  label: string;
  format: (n: number) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (latest) => setValue(latest),
    });
    return () => controls.stop();
  }, [inView, target]);

  return (
    <div ref={ref}>
      <p className="font-display text-2xl font-bold text-on-surface">{format(value)}</p>
      <p className="text-sm text-on-surface-variant">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FaqItem — small animated accordion row.                             */
/* ------------------------------------------------------------------ */
function FaqItem({
  question,
  answer,
  defaultOpen = false,
}: {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="card-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 p-5 text-start"
        aria-expanded={open}
      >
        <span className="flex items-center gap-3 font-display text-sm font-bold text-on-surface sm:text-base">
          <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
          {question}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="h-4 w-4 shrink-0 text-on-surface-variant" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-5 text-sm leading-relaxed text-on-surface-variant">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter — self-contained subscribe form.                         */
/* Assumes a `${apiUrl}/newsletter/subscribe` endpoint accepting        */
/* `{ email }`; adjust the path if your API differs.                   */
/* ------------------------------------------------------------------ */
const newsletterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});
type NewsletterFormValues = z.infer<typeof newsletterSchema>;

function NewsletterSection({ apiUrl }: { apiUrl: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = (values: NewsletterFormValues) => {
    setStatus("loading");
    setMessage("");
    axios
      .post(`${apiUrl}/newsletter/subscribe`, values)
      .then(() => {
        setStatus("success");
        setMessage("You're on the list — thanks for subscribing!");
        reset();
      })
      .catch((err) => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Something went wrong. Please try again.");
      });
  };

  return (
    <section className="bg-surface-container-low/30 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl px-4 text-center sm:px-6 lg:px-10">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-container/15 text-primary">
          <Mail className="h-6 w-6" />
        </span>
        <h2 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
          Stay in the loop
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-on-surface-variant">
          New academy listings, parenting tips, and product updates — no spam, unsubscribe anytime.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <div className="flex-1 text-start">
            <Input
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-error">{errors.email.message}</p>
            )}
          </div>
          <Button type="submit" loading={status === "loading"} className="justify-center gap-1.5">
            Subscribe <Send className="h-4 w-4" />
          </Button>
        </form>

        {message && (
          <p
            className={`mt-4 text-xs font-semibold ${status === "success" ? "text-tertiary" : "text-error"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </section>
  );
}