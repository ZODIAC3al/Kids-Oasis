'use client';

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, MapPin, Users, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

interface CardProps {
  id: number | string;
  location?: string;
  name: string;
  summary?: string;
  groupSize?: string | number;
  numberOfChildren?: string | number;
  rate?: number;
  contact?: string;
  price?: number;
  reviews?: string | number;
  description?: string;
  discount?: number;
}

const PALETTE = ["#FF6F5E", "#2EC4B6", "#FFC93C"];

export default function Card({
  id,
  location = "Alexandria",
  name,
  summary = "Where young minds flourish and thrive.",
  rate = 4.5,
  price = 1500,
  reviews = "12",
  discount = 0,
  contact = "01254684456",
  groupSize = "30",
  numberOfChildren = "25",
  description = ""
}: CardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const router = useRouter();

  // Convert string Mongo ID hash to stable index for PALETTE array
  const numericId = typeof id === "number" ? id : parseInt(id.replace(/\D/g, "").slice(-4)) || 0;
  const accent = PALETTE[numericId % PALETTE.length];

  const handleClick = () => {
    router.push(`/academies/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  return (
    <motion.div
      whileHover={{ y: -6 }}
      onClick={handleClick}
      className="bg-white dark:bg-[#1E293B] rounded-[28px] overflow-hidden border-4 border-[#2B2440]/5 dark:border-white/5 shadow-[0_10px_0_0_rgba(43,36,64,0.06)] hover:shadow-lg transition-all cursor-pointer"
    >
      <div className="relative h-44 flex items-center justify-center" style={{ backgroundColor: `${accent}22` }}>
        <span className="text-4xl font-extrabold font-heading" style={{ color: accent }}>
          {name.charAt(0)}
        </span>

        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-[#FFC93C] text-[#2B2440] text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
            Save EGP {discount}
          </span>
        )}

        <button
          onClick={handleFavoriteClick}
          aria-label="Save to favorites"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-800/90 flex items-center justify-center shadow-sm hover:scale-105 transition-transform"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? "fill-[#FF6F5E] text-[#FF6F5E]" : "text-[#2B2440]/40 dark:text-slate-400"}`} />
        </button>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-extrabold text-[#2B2440] dark:text-white font-heading truncate">{name}</h3>
          <span className="flex items-center gap-1 text-xs font-extrabold text-[#8a5a00] dark:text-[#FFC93C] bg-[#FFC93C]/25 px-2 py-1 rounded-full shrink-0">
            <Star className="w-3 h-3 fill-current text-amber-500" /> {rate}
          </span>
        </div>

        <p className="text-sm text-[#2B2440]/60 dark:text-slate-300 line-clamp-2">{summary}</p>

        <p className="flex items-center gap-1.5 text-xs font-semibold text-[#2B2440]/50 dark:text-slate-450">
          <MapPin className="w-3.5 h-3.5 text-[#FF6F5E]" /> {location}
        </p>

        <div className="flex items-center justify-between pt-2 border-t-2 border-dashed border-[#2B2440]/10 dark:border-white/10">
          <div>
            <span className="text-lg font-extrabold text-[#2B2440] dark:text-white">EGP {price - discount}</span>
            <span className="text-xs text-[#2B2440]/40 dark:text-slate-400"> /month</span>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            className="px-4 py-2 rounded-full bg-[#FF6F5E] text-white text-xs font-extrabold shadow-[0_3px_0_0_#e85a49] hover:translate-y-[1px] hover:shadow-[0_2px_0_0_#e85a49] transition-all"
          >
            Book visit
          </button>
        </div>

        <p className="text-[11px] text-[#2B2440]/40 dark:text-slate-500 flex items-center gap-3 pt-1">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3 text-[#4F46E5]" /> {reviews} reviews
          </span>
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3 text-[#0EA5E9]" /> {contact}
          </span>
        </p>
      </div>
    </motion.div>
  );
}
