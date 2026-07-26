"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Sparkles, BookOpen } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { API_URL } from "@/lib/config";

interface NewsItem {
  _id?: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image?: string;
}

import { useTranslations, useLocale } from "next-intl";

export default function BlogPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const tBlog = useTranslations("blogPage");
  const locale = useLocale();

  const apiUrl = API_URL;

  useEffect(() => {
    let cancelled = false;
    const fetchNews = async () => {
      try {
        const res = await axios.get<NewsItem[]>(`${apiUrl}/site/news`);
        if (!cancelled && Array.isArray(res.data) && res.data.length > 0) {
          setNews(res.data);
        } else if (!cancelled) {
          setNews([
            {
              title: "How to Build Independent Cleaning & Hygiene Habits in Toddlers",
              date: "September 22, 2024",
              author: "Tina White",
              category: "Parenting Tips",
              image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Top 10 Indoor STEM Play Activities for Rainy Days",
              date: "September 22, 2024",
              author: "Tina White",
              category: "Play & Learning",
              image: "https://images.unsplash.com/photo-1587616211892-b8e563e0fd94?q=80&w=800&auto=format&fit=crop",
            },
            {
              title: "Five Essential Books Every Parent Should Read This Year",
              date: "September 22, 2024",
              author: "Tina White",
              category: "Book Reviews",
              image: "https://images.unsplash.com/photo-1526634332515-d56c5fd16991?q=80&w=800&auto=format&fit=crop",
            },
          ]);
        }
      } catch (err) {
        if (!cancelled) {
          setNews([
            {
              title: "How to Build Independent Cleaning & Hygiene Habits in Toddlers",
              date: "September 22, 2024",
              author: "Tina White",
              category: "Parenting Tips",
              image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop",
            },
          ]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchNews();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary shadow-elevation-1 mb-4">
            <Sparkles className="h-3.5 w-3.5" /> Educational Insights
          </span>
          <h1 className="font-display text-3xl font-bold text-on-surface sm:text-4xl lg:text-5xl">
            Kids Oasis Blog & News
          </h1>
          <p className="mt-4 text-base text-on-surface-variant leading-relaxed">
            Expert guidance, parenting strategies, and early education insights written by child psychologists and teachers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
              className="card-surface group overflow-hidden flex flex-col justify-between transition hover:-translate-y-1 hover:shadow-elevation-2"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={item.image || "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop"}
                    alt={item.title}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-surface/90 px-2.5 py-0.5 text-xs font-bold text-primary backdrop-blur-md">
                    {item.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant">
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="h-3.5 w-3.5" /> {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" /> {item.author}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold text-on-surface group-hover:text-primary transition line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Button variant="outline" size="sm" className="w-full justify-center">
                  {tBlog("readArticle")} <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
