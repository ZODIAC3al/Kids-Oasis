"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import axios from "axios";
import { API_URL } from "@/lib/config";
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

  const tAcad = useTranslations("academies");
  const tNav = useTranslations("nav");
  const locale = useLocale();

  const apiUrl = API_URL;

  useEffect(() => {
    let cancelled = false;
    const fetchAcademies = async () => {
      try {
        const res = await axios.get<any[]>(`${apiUrl}/academies`);
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AcademyItem[] = res.data.map((item) => ({
            id: item._id || item.id,
            name: item.name,
            description: item.description,
            location: item.location || item.address || "Alexandria, Egypt",
            rating: item.rating || 4.8,
            totalReviews: item.totalReviews || 95,
            price: item.price || 1400,
            logo: item.logo || "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
            activities: item.activities || ["STEM Focus", "Verified"],
            minAgeAllowed: item.minAgeAllowed || 2,
            maxAgeAllowed: item.maxAgeAllowed || 6,
          }));
          setAcademies(mapped);
          dispatch(setAcademiesList(mapped));
        } else if (!cancelled) {
          setAcademies(mockAcademies);
          dispatch(setAcademiesList(mockAcademies));
        }
      } catch (err) {
        if (!cancelled) {
            setAcademies(mockAcademies);
            dispatch(setAcademiesList(mockAcademies));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchAcademies();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, dispatch]);

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

  const filteredAcademies = useMemo(() => {
    return academies.filter((ac) => {
      // 1. Search Query (Name, Description, Location, Curriculum, Activities, Languages)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = ac.name.toLowerCase().includes(q);
        const locMatch = ac.location.toLowerCase().includes(q);
        const descMatch = (ac.description || "").toLowerCase().includes(q);
        const currMatch = (ac.curriculum || "").toLowerCase().includes(q);
        const actMatch = (ac.activities || []).some((a) => a.toLowerCase().includes(q));
        const langMatch = (ac.languages || []).some((l) => l.toLowerCase().includes(q));
        if (!nameMatch && !locMatch && !descMatch && !currMatch && !actMatch && !langMatch) {
          return false;
        }
      }

      // 2. Age Range Filter
      if (selectedAge !== "all") {
        const minAge = ac.minAgeAllowed ?? 0;
        const maxAge = ac.maxAgeAllowed ?? 12;

        if (selectedAge === "0-3 Yrs" && (minAge > 3 || maxAge < 0)) return false;
        if (selectedAge === "4-6 Yrs" && (minAge > 6 || maxAge < 4)) return false;
        if (selectedAge === "7-9 Yrs" && (minAge > 9 || maxAge < 7)) return false;
        if (selectedAge === "10+ Yrs" && maxAge < 10) return false;
      }

      // 3. Price Filter
      if (minPrice && ac.price < Number(minPrice)) return false;
      if (maxPrice && ac.price > Number(maxPrice)) return false;

      // 4. Facilities & Activities Filter
      if (selectedFacilities.length > 0) {
        const acActivitiesStr = [
          ...(ac.activities || []),
          ac.curriculum || "",
          ac.description || "",
        ]
          .join(" ")
          .toLowerCase();

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
  }, [academies, searchQuery, selectedAge, minPrice, maxPrice, selectedFacilities]);

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
                  {filteredAcademies.length} {tAcad("facilitiesFound")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="flex lg:hidden items-center gap-1.5 rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-low px-3 py-2 text-xs font-semibold text-on-surface"
                >
                  <SlidersHorizontal className="h-4 w-4" /> {tAcad("filters")}
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
                        {(ac.activities || ["STEM Focus", "NAEYC"]).map((tag) => {
                          const translatedTag =
                            locale === "ar"
                              ? tag === "STEM Focus" || tag === "STEM"
                                ? "منهج STEM"
                                : tag === "Montessori"
                                ? "مونتيسوري"
                                : tag === "Quran"
                                ? "تحفيظ قرآن"
                                : tag === "Robotics"
                                ? "روبوتات"
                                : tag === "Coding"
                                ? "برمجة"
                                : tag === "Gymnastics"
                                ? "جمباز"
                                : tag === "Art"
                                ? "فنون إبداعية"
                                : tag === "Swimming"
                                ? "سباحة"
                                : tag === "Chess"
                                ? "شطرنج"
                                : tag
                              : tag;
                          return (
                            <span
                              key={tag}
                              className="rounded-full bg-surface-container-high px-2.5 py-0.5 text-[11px] font-medium text-on-surface-variant"
                            >
                              {translatedTag}
                            </span>
                          );
                        })}
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
          </div>
        </div>
      </main>

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
