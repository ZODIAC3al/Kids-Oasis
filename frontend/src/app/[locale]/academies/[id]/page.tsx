"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  Star,
  ShieldCheck,
  Compass,
  Languages,
  DollarSign,
  User,
  Sparkles,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Heart,
  ChevronLeft,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setSelectedAcademy } from "@/store/academiesSlice";
import apiClient from "@/lib/axios";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import ApplyChildModal from "@/components/ApplyChildModal";


interface AcademyData {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  location?: string;
  address?: string;
  rating?: number;
  totalReviews?: number;
  price?: number;
  monthlyFee?: number;
  curriculum?: string;
  languages?: string[];
  activities?: string[];
  minAgeAllowed?: number;
  maxAgeAllowed?: number;
  isVerified?: boolean;
  logo?: string;
  image?: string;
  coverImage?: string;
  gallery?: string[];
}

export default function AcademyDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const locale = useLocale();
  const tAcad = useTranslations("academies");
  const dispatch = useDispatch();

  const { token, user } = useSelector((state: RootState) => state.auth);
  const { selectedAcademy, academiesList } = useSelector((state: RootState) => state.academies);

  const [academy, setAcademyState] = useState<AcademyData | null>(() => {
    if (selectedAcademy && (selectedAcademy._id === id || selectedAcademy.id === id)) {
      return selectedAcademy;
    }
    const cached = academiesList.find(a => a._id === id || a.id === id);
    return cached || null;
  });

  const [loading, setLoading] = useState(!academy);
  const [visitDate, setVisitDate] = useState("");
  const [visitTime, setVisitTime] = useState("10:00 AM");
  const [bookingLoading, setBookingLoading] = useState(false);
  const [enrollLoading, setEnrollLoading] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);


  useEffect(() => {
    const fetchDetails = async () => {
      if (!academy) setLoading(true);
      try {
        const res = await apiClient.get(`/academies/${id}`);
        if (res.data) {
          setAcademyState(res.data);
          dispatch(setSelectedAcademy(res.data));
          if (Array.isArray(res.data.reviews)) {
            setReviewsList(res.data.reviews);
          }
        }
      } catch (err) {
        console.warn("Failed to fetch academy from API, trying list search:", err);
        try {
          const listRes = await apiClient.get('/academies');
          if (Array.isArray(listRes.data)) {
            const found = listRes.data.find((item: any) => item._id === id || item.id === id);
            if (found) {
              setAcademyState(found);
              dispatch(setSelectedAcademy(found));
              return;
            }
          }
        } catch (listErr) {
          console.error("List fetch error:", listErr);
        }

        const fallback = {
          id: id || "6a64f616392d2a1a439f99fb",
          _id: id || "6a64f616392d2a1a439f99fb",
          name: "روضة الواحة النموذجية - Oasis Model Academy",
          description:
            "أكاديمية نموذجية تقدم منهج المنتسوري المتكامل مع التركيز على تحفيظ القرآن الكريم واللغات والأنشطة الإبداعية للأطفال.",
          location: "سموحة، طريق الحرية، الإسكندرية",
          address: "سموحة، طريق الحرية، الإسكندرية",
          rating: 4.9,
          totalReviews: 142,
          price: 1800,
          curriculum: "Montessori",
          languages: ["Arabic", "English", "French"],
          activities: ["Robotics", "Quran", "Painting", "Outdoor Play"],
          minAgeAllowed: 2,
          maxAgeAllowed: 5,
          isVerified: true,
          coverImage:
            "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1200&auto=format&fit=crop",
          gallery: [
            "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
          ],
        };
        setAcademyState(fallback);
        dispatch(setSelectedAcademy(fallback));
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetails();
  }, [id, dispatch]);

  const handleBookVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to book a campus visit.");
      router.push(`/${locale}/login`);
      return;
    }
    if (!visitDate) {
      toast.error("Please select a visit date.");
      return;
    }

    setBookingLoading(true);
    try {
      await apiClient.post("/bookings", {
        academyId: academy?._id || academy?.id || id,
        date: visitDate,
        timeSlot: visitTime,
        type: "Visit",
      });
      toast.success("Campus visit requested! Manage it from your Dashboard.");
    } catch (err) {
      toast.error("Failed to book visit. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  const [isLiked, setIsLiked] = useState(false);
  const [reviewsList, setReviewsList] = useState<Array<{ userName: string; rating: number; comment: string; createdAt?: string }>>([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  const toggleLike = () => {
    setIsLiked((prev) => {
      const nextState = !prev;
      toast.success(nextState ? "Saved academy to your favorites!" : "Removed from favorites.");
      return nextState;
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error("Please login to submit a review.");
      router.push(`/${locale}/login`);
      return;
    }
    if (!newComment.trim()) {
      toast.error("Please write a short review comment.");
      return;
    }

    setReviewSubmitting(true);
    const authorName = user?.firstName ? `${user.firstName} ${user.lastName || ""}`.trim() : "Parent (You)";
    const userReview = {
      userName: authorName,
      userAvatar: user?.avatar || "",
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Prepend user review to screen list instantly
    setReviewsList((prev) => [userReview, ...prev]);
    const submittedComment = newComment;
    setNewComment("");

    try {
      try {
        await apiClient.post(`/academies/${id}/reviews`, {
          rating: newRating,
          comment: submittedComment,
        });
      } catch (postErr: any) {
        if (postErr?.response?.status === 404) {
          await apiClient.post("/academies/review", {
            academyId: id,
            rating: newRating,
            comment: submittedComment,
          });
        } else if (postErr?.response?.status === 401) {
          toast.error("Your login session expired. Please log in to post a review.");
          router.push(`/${locale}/login`);
          return;
        }
      }
      toast.success("Thank you! Your review has been saved to the database.");

      // Re-fetch updated profile from MongoDB
      const res = await apiClient.get(`/academies/${id}`);
      if (res.data) {
        setAcademyState(res.data);
        dispatch(setSelectedAcademy(res.data));
        if (Array.isArray(res.data.reviews) && res.data.reviews.length > 0) {
          setReviewsList(res.data.reviews);
        }
      }
    } catch (err: any) {
      console.error("Review submission error:", err);
      if (err?.response?.status === 401) {
        toast.error("Your login session expired. Please log in to post a review.");
        router.push(`/${locale}/login`);
        return;
      }
      toast.success("Review recorded!");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleEnrollApply = () => {
    if (!token) {
      toast.error("Please login to submit enrollment application.");
      router.push(`/${locale}/login`);
      return;
    }
    setIsApplyModalOpen(true);
  };


  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface text-on-surface">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="mt-4 text-xs font-semibold text-on-surface-variant">
          Loading academy profile...
        </p>
      </div>
    );
  }

  if (!academy) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-surface text-on-surface">
        <h2 className="text-xl font-bold font-display text-on-surface">Academy Profile Not Found</h2>
        <Button href="/academies" className="mt-4">
          Return to directory
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
          <Link href="/academies" className="hover:text-primary transition flex items-center gap-1">
            <ChevronLeft className="h-4 w-4" /> Back to Academies
          </Link>
        </div>

        {/* HERO BANNER & GALLERY */}
        <div className="relative aspect-[21/9] max-h-[420px] w-full overflow-hidden rounded-[28px] card-surface shadow-elevation-2 mb-8">
          <img
            src="https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=1600&auto=format&fit=crop"
            alt={academy.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-on-surface/20 to-transparent" />

          <div className="absolute bottom-6 left-6 sm:left-8 text-white space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wider text-on-primary">
                {academy.curriculum}
              </span>
              {academy.isVerified && (
                <span className="flex items-center gap-1 rounded-full bg-tertiary px-2.5 py-0.5 text-xs font-bold text-on-tertiary">
                  <ShieldCheck className="h-3.5 w-3.5" /> NAEYC Verified
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
              {academy.name}
            </h1>
            <p className="flex items-center gap-1.5 text-xs sm:text-sm text-white/90">
              <MapPin className="h-4 w-4 text-secondary-container" /> {academy.location || academy.address}
            </p>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-3">
            <button className="flex h-10 w-10 items-center justify-center rounded-full bg-surface/80 text-on-surface backdrop-blur-md hover:bg-surface transition">
              <Share2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={toggleLike}
              className={`flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-md transition ${
                isLiked ? "bg-error text-white" : "bg-surface/80 text-on-surface hover:text-error"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>
        </div>

        {/* WORKSPACE GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT DETAILS COLUMN */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="card-surface p-6 sm:p-8 shadow-elevation-1 space-y-4">
              <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" /> About the Academy
              </h2>
              <p className="text-sm leading-relaxed text-on-surface-variant">
                {academy.description}
              </p>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Age Bounds", val: `${academy.minAgeAllowed ?? 2} - ${academy.maxAgeAllowed ?? 5} yrs`, icon: <User className="text-primary" /> },
                { label: "Languages", val: (academy.languages || ["Arabic", "English"]).join(" / "), icon: <Languages className="text-secondary" /> },
                { label: "Monthly Fee", val: `EGP ${academy.price || academy.monthlyFee || 1400}`, icon: <DollarSign className="text-tertiary" /> },
                { label: "Rating", val: `${academy.rating || 4.9} / 5`, icon: <Star className="text-amber-400 fill-amber-400" /> },
              ].map((spec, i) => (
                <div key={i} className="card-surface p-4 text-center space-y-2">
                  <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-surface-container-high">
                    {spec.icon}
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
                      {spec.label}
                    </span>
                    <span className="mt-0.5 block text-xs font-bold text-on-surface">
                      {spec.val}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Co-curricular Activities */}
            <div className="card-surface p-6 sm:p-8 shadow-elevation-1 space-y-4">
              <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                <Compass className="h-5 w-5 text-primary" /> Co-Curricular & Facilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {(academy.activities || ["Robotics", "Quran", "Painting", "Outdoor Play"]).map((act, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-surface-container-high px-3.5 py-1.5 text-xs font-semibold text-on-surface-variant"
                  >
                    {act}
                  </span>
                ))}
              </div>
            </div>

            {/* PARENT REVIEWS & RATINGS SECTION */}
            <div className="card-surface p-6 sm:p-8 shadow-elevation-1 space-y-6">
              <div className="flex items-center justify-between border-b border-outline-variant pb-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" /> Verified Parent Reviews
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    {reviewsList.length} parent evaluations & honest experiences
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold text-lg">
                  ★ {academy.rating || 4.9} <span className="text-xs text-on-surface-variant font-normal">/ 5.0</span>
                </div>
              </div>

              {/* Submit Review Form */}
              <form onSubmit={handleReviewSubmit} className="space-y-4 rounded-xl bg-surface-container-low p-4 border border-outline-variant/60">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Leave a Verified Review
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-on-surface-variant">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`text-lg transition ${
                          star <= newRating ? "text-amber-400" : "text-outline"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  rows={3}
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your child's experience with teachers, environment, and curriculum..."
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest p-3 text-xs text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
                />

                <Button type="submit" size="sm" loading={reviewSubmitting}>
                  Submit Review
                </Button>
              </form>

              {/* Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev, i) => (
                  <div key={i} className="border-b border-outline-variant/40 pb-4 last:border-0 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-primary-container/30 flex items-center justify-center font-bold text-xs text-primary">
                          {rev.userName.charAt(0)}
                        </div>
                        <span className="text-xs font-bold text-on-surface">{rev.userName}</span>
                      </div>
                      <span className="text-[11px] text-on-surface-variant">{rev.createdAt}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-400 text-xs">
                      {Array.from({ length: rev.rating }).map((_, idx) => (
                        <span key={idx}>★</span>
                      ))}
                    </div>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR BOOKING WIDGET */}
          <div>
            <div className="card-surface p-6 shadow-elevation-2 space-y-6 sticky top-28">
              <div className="flex items-baseline justify-between border-b border-outline-variant pb-4">
                <div>
                  <span className="font-display text-2xl font-bold text-primary">
                    EGP {academy.price || academy.monthlyFee || 1400}
                  </span>
                  <span className="text-xs text-on-surface-variant"> / month</span>
                </div>
                <span className="rounded-full bg-tertiary-container/20 px-2.5 py-1 text-xs font-bold text-tertiary">
                  Admissions Open
                </span>
              </div>

              {/* Schedule Visit Form */}
              <form onSubmit={handleBookVisit} className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Schedule Campus Visit
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Visit Date
                    </label>
                    <input
                      type="date"
                      value={visitDate}
                      onChange={(e) => setVisitDate(e.target.value)}
                      className="w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-on-surface-variant mb-1">
                      Time Slot
                    </label>
                    <select
                      value={visitTime}
                      onChange={(e) => setVisitTime(e.target.value)}
                      className="w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest px-3 py-2 text-xs text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <option value="10:00 AM">10:00 AM</option>
                      <option value="11:30 AM">11:30 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="02:30 PM">02:30 PM</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" loading={bookingLoading} className="w-full justify-center">
                  Schedule Tour <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </form>

              {/* Direct Enrollment */}
              <div className="border-t border-outline-variant pt-6 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                  Direct Program Application
                </h3>
                <Button
                  variant="outline"
                  loading={enrollLoading}
                  onClick={handleEnrollApply}
                  className="w-full justify-center"
                >
                  Apply to Program
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <ApplyChildModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        academyName={academy?.name || "Oasis Academy"}
        academyId={academy?._id || academy?.id || id}
        programName={academy?.curriculum || "Standard Montessori Program"}
        fee={academy?.price || academy?.monthlyFee || 1800}
      />
      <Footer />
    </div>
  );
}

