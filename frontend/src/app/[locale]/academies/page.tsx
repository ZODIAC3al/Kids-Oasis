"use client";

import { useState, useEffect, useMemo, Suspense, useCallback } from "react";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { API_URL, getApiUrl } from "@/lib/config";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Star,
  Heart,
  SlidersHorizontal,
  Grid,
  List,
  Map as MapIcon,
  RotateCcw,
  Check,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

interface AcademyItem {
  id: string;
  _id?: string;
  name: string;
  description: string;
  location: string;
  rating: number;
  totalReviews: number;
  price: number;
  logo?: string;
  curriculum?: string;
  languages?: string[];
  activities?: string[];
  minAgeAllowed?: number;
  maxAgeAllowed?: number;
}

const mockAcademies: AcademyItem[] = [
  {
    id: "1",
    name: "روضة الواحة النموذجية - Oasis Model Academy",
    description: "أكاديمية نموذجية تقدم منهج المنتسوري المتكامل مع التركيز على تحفيظ القرآن الكريم واللغات والأنشطة الإبداعية للأطفال.",
    location: "Smouha, Alexandria",
    rating: 4.9,
    totalReviews: 142,
    price: 1800,
    logo: "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
    activities: ["Montessori", "Quran", "Robotics"],
    minAgeAllowed: 2,
    maxAgeAllowed: 5,
  },
  {
    id: "2",
    name: "أكاديمية الفرسان الصغيرة - Little Knights Academy",
    description: "أكاديمية ترفيهية وتعليمية تركز على تنمية مهارات التفكير المنطقي والبرمجة والأنشطة الرياضية واللغة الإنجليزية.",
    location: "Roushdy, Alexandria",
    rating: 4.8,
    totalReviews: 98,
    price: 2200,
    logo: "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=1200&auto=format&fit=crop",
    activities: ["STEM", "Gymnastics", "Coding"],
    minAgeAllowed: 3,
    maxAgeAllowed: 7,
  },
  {
    id: "3",
    name: "حضانة البراعم المبدعة - Creative Shoots Preschool",
    description: "بيئة آمنة ومحفزة للطفل تعتمد على الاستكشاف واللعب الحر والفنون وتطوير السلوك الإيجابي واللغات متعددة.",
    location: "Maadi, Cairo",
    rating: 5.0,
    totalReviews: 215,
    price: 2500,
    logo: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
    activities: ["Reggio Emilia", "Art", "Swimming"],
    minAgeAllowed: 1,
    maxAgeAllowed: 4,
  },
  {
    id: "4",
    name: "أكاديمية علماء المستقبل - Future Scientists Academy",
    description: "مركز متخصص لتنمية الذكاء العلمي والابتكار المبكر والتجارب التفاعلية ورعاية الموهوبين.",
    location: "Sheikh Zayed, Giza",
    rating: 4.9,
    totalReviews: 180,
    price: 3000,
    logo: "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
    activities: ["STEM", "Chess", "Drama"],
    minAgeAllowed: 3,
    maxAgeAllowed: 8,
  },
];

import { useTranslations, useLocale } from "next-intl";
import { useDispatch } from "react-redux";
import { setAcademiesList } from "@/store/academiesSlice";

const ITEMS_PER_PAGE = 6;

function AcademySearchContent() {
  const dispatch = useDispatch();
  const [academies, setAcademies] = useState<AcademyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAge, setSelectedAge] = useState<string>("all");
  const [maxDistance, setMaxDistance] = useState<number>(15);
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMap, setShowMap] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const tAcad = useTranslations("academies");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const apiUrl = getApiUrl();
  const [debouncedSearch] = useDebounce(searchQuery, 400);

  const fetchAcademies = useCallback(async (page: number, signal?: AbortSignal) => {
    setLoading(true);
    try {
      const params: Record<string, any> = { page, limit: ITEMS_PER_PAGE };
      if (debouncedSearch) params.search = debouncedSearch;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;

      const res = await axios.get<any>(`${apiUrl}/academies`, { params, signal });
      const envelope = res.data;

      // Handle both old flat-array response and new paginated envelope
      const rawList = Array.isArray(envelope) ? envelope : (envelope?.data ?? []);
      const serverTotal: number = !Array.isArray(envelope) && envelope?.total
        ? envelope.total
        : rawList.length;
      const serverPages: number = !Array.isArray(envelope) && envelope?.totalPages
        ? envelope.totalPages
        : 1;

      if (rawList.length > 0) {
        const mapped: AcademyItem[] = rawList.map((item: any) => ({
          id: item._id || item.id,
          name: item.name,
          description: item.description,
          location: item.city
            ? `${item.city}${item.governorate ? ", " + item.governorate : ""}`
            : (item.address || item.location || "Egypt"),
          rating: item.rating || 4.8,
          totalReviews: item.totalReviews || 95,
          price: item.price || 1400,
          logo: item.logo || "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
          activities: Array.isArray(item.activities) ? item.activities : (item.activities ? String(item.activities).split(" ") : ["Verified"]),
          curriculum: item.curriculum,
          languages: Array.isArray(item.languages) ? item.languages : (item.languages ? String(item.languages).split(" ") : []),
          minAgeAllowed: item.minAgeAllowed || 2,
          maxAgeAllowed: item.maxAgeAllowed || 6,
        }));
        setAcademies(mapped);
        setTotalCount(serverTotal);
        setTotalPages(serverPages);
        dispatch(setAcademiesList(mapped));
      } else {
        setAcademies(mockAcademies);
        setTotalCount(mockAcademies.length);
        setTotalPages(1);
        dispatch(setAcademiesList(mockAcademies));
      }
    } catch (err: any) {
      if (err?.name === "CanceledError" || err?.name === "AbortError") return;
      setAcademies(mockAcademies);
      setTotalCount(mockAcademies.length);
      setTotalPages(1);
      dispatch(setAcademiesList(mockAcademies));
    } finally {
      setLoading(false);
    }
  }, [apiUrl, dispatch, debouncedSearch, minPrice, maxPrice]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, minPrice, maxPrice, selectedAge, selectedFacilities]);

  useEffect(() => {
    const controller = new AbortController();
    fetchAcademies(currentPage, controller.signal);
    return () => controller.abort();
  }, [fetchAcademies, currentPage]);


  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility) ? prev.filter((f) => f !== facility) : [...prev, facility]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedAge("all");
    setMaxDistance(15);
    setMinPrice("");
    setMaxPrice("");
    setSelectedFacilities([]);
  };

  // Client-side age & facility filter applied on top of server results
  const filteredAcademies = useMemo(() => {
    return academies.filter((ac) => {
      // Age Range Filter (kept client-side for UX)
      if (selectedAge !== "all") {
        const minAge = ac.minAgeAllowed ?? 0;
        const maxAge = ac.maxAgeAllowed ?? 12;
        if (selectedAge === "0-3 Yrs" && (minAge > 3 || maxAge < 0)) return false;
        if (selectedAge === "4-6 Yrs" && (minAge > 6 || maxAge < 4)) return false;
        if (selectedAge === "7-9 Yrs" && (minAge > 9 || maxAge < 7)) return false;
        if (selectedAge === "10+ Yrs" && maxAge < 10) return false;
      }
      // Facilities & Activities Filter (kept client-side)
      if (selectedFacilities.length > 0) {
        const acActivitiesStr = [
          ...(ac.activities || []),
          ac.curriculum || "",
          ac.description || "",
        ].join(" ").toLowerCase();
        const matchesAllFacilities = selectedFacilities.every((fac) => {
          const keyword = fac.toLowerCase();
          if (keyword.includes("stem")) return acActivitiesStr.includes("stem") || acActivitiesStr.includes("robotics");
          if (keyword.includes("outdoor")) return acActivitiesStr.includes("outdoor") || acActivitiesStr.includes("gardening");
          if (keyword.includes("meals")) return acActivitiesStr.includes("meal") || acActivitiesStr.includes("cooking") || acActivitiesStr.includes("food");
          if (keyword.includes("transport")) return acActivitiesStr.includes("transport") || acActivitiesStr.includes("bus");
          return acActivitiesStr.includes(keyword);
        });
        if (!matchesAllFacilities) return false;
      }
      return true;
    });
  }, [academies, selectedAge, selectedFacilities]);

  // Count active filters for badge
  const activeFilterCount =
    (selectedAge !== "all" ? 1 : 0) +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    selectedFacilities.length;

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      {/* Sub-header Filter Search Bar */}
      <div className="sticky top-[72px] z-40 border-b border-outline-variant/60 bg-surface-container-low/95 backdrop-blur-md py-3 px-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-full border border-outline-variant bg-surface-container-lowest px-4 py-2 shadow-elevation-1 focus-within:ring-2 focus-within:ring-primary/20">
            <Search className="h-4 w-4 text-on-surface-variant shrink-0" />
            <input
              type="text"
              placeholder="Search by academy name, city, or curriculum..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none"
            />
            <div className="hidden h-5 w-px bg-outline-variant sm:block" />
            <div className="hidden items-center gap-2 text-xs text-on-surface-variant sm:flex shrink-0">
              <Calendar className="h-3.5 w-3.5" />
              <span>Fall 2026</span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* DESKTOP FILTER SIDEBAR */}
          <aside className="hidden lg:block w-[280px] shrink-0 card-surface p-6 h-fit sticky top-[150px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-lg font-bold text-on-surface">{tAcad("filters")}</h2>
              <button
                onClick={resetFilters}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <RotateCcw className="h-3 w-3" /> {tAcad("reset")}
              </button>
            </div>

            {/* Filter: Age Range */}
            <div className="mb-6 border-b border-outline-variant pb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                {tAcad("ageRange")}
              </h3>
              <div className="flex flex-wrap gap-2">
                {["all", "0-3 Yrs", "4-6 Yrs", "7-9 Yrs", "10+ Yrs"].map((age) => (
                  <button
                    key={age}
                    onClick={() => setSelectedAge(age)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition ${
                      selectedAge === age
                        ? "bg-primary text-on-primary shadow-elevation-1"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                    }`}
                  >
                    {age === "all" ? tAcad("allAges") : age}
                  </button>
                ))}
              </div>
            </div>

            {/* Filter: Distance */}
            <div className="mb-6 border-b border-outline-variant pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
                  {tAcad("distance")}
                </h3>
                <span className="text-xs font-bold text-primary">{tAcad("upTo")} {maxDistance} mi</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                value={maxDistance}
                onChange={(e) => setMaxDistance(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>

            {/* Filter: Monthly Fee */}
            <div className="mb-6 border-b border-outline-variant pb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                {tAcad("monthlyFee")}
              </h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder={tAcad("min")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs text-on-surface outline-none focus-visible:outline-primary"
                />
                <span className="text-xs text-on-surface-variant">-</span>
                <input
                  type="number"
                  placeholder={tAcad("max")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest px-3 py-1.5 text-xs text-on-surface outline-none focus-visible:outline-primary"
                />
              </div>
            </div>

            {/* Filter: Facilities */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">
                {tAcad("facilities")}
              </h3>
              <div className="space-y-2.5">
                {["Transportation", "Meals Included", "STEM Lab", "Outdoor Playground"].map((facility) => {
                  const checked = selectedFacilities.includes(facility);
                  return (
                    <label key={facility} className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-on-surface">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFacility(facility)}
                        className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span>{facility}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* MAIN RESULTS CANVAS */}
          <div className="flex-1">
            {/* Header Title Bar & View Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display text-2xl font-bold text-on-surface sm:text-3xl">
                  {tAcad("academiesAndNurseries")}
                </h1>
                <p className="text-sm text-on-surface-variant mt-1">
                  {totalCount} {tAcad("facilitiesFound")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Mobile filters trigger button with badge */}
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="relative flex lg:hidden items-center gap-1.5 rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface"
                >
                  <SlidersHorizontal className="h-4 w-4" /> {tAcad("filters")}
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-on-primary">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                <div className="hidden sm:flex items-center rounded-xl bg-surface-container-low p-1 border border-outline-variant">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`rounded-lg p-1.5 transition ${
                      viewMode === "grid" ? "bg-surface text-primary shadow-elevation-1" : "text-on-surface-variant"
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`rounded-lg p-1.5 transition ${
                      viewMode === "list" ? "bg-surface text-primary shadow-elevation-1" : "text-on-surface-variant"
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowMap((v) => !v)}
                  className={`flex items-center gap-1.5 rounded-[var(--radius-control)] border px-3 py-2 text-xs font-semibold transition ${
                    showMap
                      ? "border-primary bg-primary-container/15 text-primary"
                      : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                  }`}
                >
                  <MapIcon className="h-4 w-4" />
                  <span>{showMap ? tAcad("hideMap") : tAcad("showMap")}</span>
                </button>
              </div>
            </div>

            {/* RESULTS GRID */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="card-surface h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                    : "flex flex-col gap-4"
                }
              >
                {filteredAcademies.map((ac, idx) => (
                  <motion.div
                    key={ac.id || idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="card-surface group overflow-hidden flex flex-col transition hover:-translate-y-1 hover:shadow-elevation-2"
                  >
                    {/* Card Media Header */}
                    <div className="relative aspect-[16/10] w-full overflow-hidden">
                      <Image
                        src={ac.logo || "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop"}
                        alt={ac.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                      <button
                        onClick={() => toggleFavorite(ac.id)}
                        className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-surface/80 backdrop-blur-md text-on-surface hover:text-error transition"
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            favorites[ac.id] ? "fill-error text-error" : ""
                          }`}
                        />
                      </button>
                      <div className="absolute top-3 left-3 flex items-center gap-1 rounded-lg bg-surface/90 px-2 py-1 text-xs font-semibold text-on-surface backdrop-blur-md">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        <span>{ac.rating}</span>
                        <span className="text-[11px] text-on-surface-variant">({ac.totalReviews})</span>
                      </div>
                    </div>

                    {/* Card Content Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="font-display text-lg font-bold text-on-surface line-clamp-1">
                          {ac.name}
                        </h3>
                        <div className="text-right shrink-0 ml-2">
                          <span className="font-display text-lg font-bold text-primary">
                            {locale === "ar" ? `ج.م ${ac.price}` : `$${ac.price}`}
                          </span>
                          <span className="text-[11px] text-on-surface-variant block">
                            {locale === "ar" ? "/ شهرياً" : "/ mo"}
                          </span>
                        </div>
                      </div>

                      <p className="mt-1.5 flex items-center gap-1 text-xs text-on-surface-variant">
                        <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" /> {ac.location}
                      </p>

                      <p className="mt-3 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                        {ac.description}
                      </p>

                      <div className="mt-4 pt-4 border-t border-outline-variant flex flex-wrap gap-1.5">
                        {(ac.activities || ["Verified"]).slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 pt-3 flex items-center justify-end">
                        <Button size="sm" href={`/${locale}/academies/${ac.id}`}>
                          {tAcad("viewDetails")}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* ── PAGINATION ── */}
            {!loading && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-10 flex flex-col items-center gap-4"
              >
                <p className="text-xs text-on-surface-variant">
                  Showing page <span className="font-semibold text-on-surface">{currentPage}</span> of{" "}
                  <span className="font-semibold text-on-surface">{totalPages}</span> —{" "}
                  <span className="font-semibold text-primary">{totalCount}</span> total academies
                </p>

                <div className="flex items-center gap-1.5 flex-wrap justify-center">
                  <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    aria-label="First page"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant transition hover:bg-primary-container/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronsLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant transition hover:bg-primary-container/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {(() => {
                    const pages: (number | "...")[] = [];
                    if (totalPages <= 7) {
                      for (let i = 1; i <= totalPages; i++) pages.push(i);
                    } else {
                      pages.push(1);
                      if (currentPage > 3) pages.push("...");
                      for (
                        let i = Math.max(2, currentPage - 1);
                        i <= Math.min(totalPages - 1, currentPage + 1);
                        i++
                      ) { pages.push(i); }
                      if (currentPage < totalPages - 2) pages.push("...");
                      pages.push(totalPages);
                    }
                    return pages.map((p, i) =>
                      p === "..." ? (
                        <span key={`e-${i}`} className="flex h-9 w-7 items-center justify-center text-xs text-on-surface-variant select-none">…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => setCurrentPage(p as number)}
                          aria-current={currentPage === p ? "page" : undefined}
                          className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl border px-2.5 text-sm font-semibold transition ${
                            currentPage === p
                              ? "border-primary bg-primary text-on-primary shadow-elevation-1"
                              : "border-outline-variant bg-surface-container-low text-on-surface hover:bg-primary-container/20 hover:text-primary hover:border-primary/40"
                          }`}
                        >
                          {p}
                        </button>
                      )
                    );
                  })()}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant transition hover:bg-primary-container/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    aria-label="Last page"
                    className="flex h-9 w-9 items-center justify-center rounded-xl border border-outline-variant bg-surface-container-low text-on-surface-variant transition hover:bg-primary-container/20 hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <ChevronsRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      {/* ═══════════════════════════════════════════════════════
          MOBILE FILTER BOTTOM SHEET DRAWER (lg:hidden)
      ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              key="mobile-filter-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setShowMobileFilters(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="mobile-filter-drawer"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-surface rounded-t-3xl shadow-2xl max-h-[88dvh] flex flex-col"
            >
              {/* Handle bar */}
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="h-1 w-10 rounded-full bg-outline-variant/60" />
              </div>

              {/* Header row */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-bold text-on-surface">Filters</h2>
                  {activeFilterCount > 0 && (
                    <span className="flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-bold text-on-primary">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest transition"
                  aria-label="Close filters"
                >
                  ✕
                </button>
              </div>

              {/* Scrollable filter content */}
              <div className="overflow-y-auto flex-1 px-5 py-4 space-y-6">

                {/* Age Range */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">Age Range</h3>
                  <div className="flex flex-wrap gap-2">
                    {["all", "0-3 Yrs", "4-6 Yrs", "7-9 Yrs", "10+ Yrs"].map((age) => (
                      <button
                        key={age}
                        onClick={() => setSelectedAge(age)}
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          selectedAge === age
                            ? "bg-primary text-on-primary shadow-elevation-1"
                            : "bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest"
                        }`}
                      >
                        {age === "all" ? "All Ages" : age}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly Fee */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">Monthly Fee (EGP)</h3>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <span className="text-on-surface-variant font-medium">—</span>
                    <div className="flex-1">
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-sm text-on-surface outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Distance */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant">Distance</h3>
                    <span className="text-sm font-bold text-primary">Up to {maxDistance} mi</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={maxDistance}
                    onChange={(e) => setMaxDistance(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer h-2"
                  />
                  <div className="flex justify-between text-xs text-on-surface-variant mt-1">
                    <span>1 mi</span><span>50 mi</span>
                  </div>
                </div>

                {/* Facilities & Activities */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-3">Facilities & Activities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {["Transportation", "Meals Included", "STEM Lab", "Outdoor Playground"].map((facility) => {
                      const checked = selectedFacilities.includes(facility);
                      return (
                        <button
                          key={facility}
                          onClick={() => toggleFacility(facility)}
                          className={`flex items-center gap-2 rounded-xl border p-3 text-left text-sm font-medium transition ${
                            checked
                              ? "border-primary bg-primary-container/20 text-primary"
                              : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"
                          }`}
                        >
                          <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-xs transition ${
                            checked ? "border-primary bg-primary text-on-primary" : "border-outline-variant"
                          }`}>
                            {checked && <Check className="h-3 w-3" />}
                          </span>
                          <span className="leading-tight">{facility}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sticky bottom action row */}
              <div className="shrink-0 border-t border-outline-variant px-5 py-4 flex gap-3 bg-surface">
                <button
                  onClick={() => { resetFilters(); }}
                  className="flex-1 rounded-xl border border-outline-variant bg-surface-container-low py-3 text-sm font-semibold text-on-surface transition hover:bg-surface-container-high active:scale-[0.97]"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="flex-2 flex-1 rounded-xl bg-primary py-3 text-sm font-bold text-on-primary shadow-elevation-1 transition hover:opacity-90 active:scale-[0.97]"
                >
                  Show {totalCount} Results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function AcademiesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading academies...</div>}>
      <AcademySearchContent />
    </Suspense>
  );
}
