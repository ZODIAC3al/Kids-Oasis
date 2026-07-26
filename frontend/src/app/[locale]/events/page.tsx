"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Sparkles, ArrowRight, Tag } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { FamilyAnimation } from "@/components/ui/lottie-animations";
import { useTranslations, useLocale } from "next-intl";

export default function EventsPage() {
  const t = useTranslations("eventsPage");
  const locale = useLocale();

  const mockEvents = [
    {
      id: "1",
      title: t("event1Title"),
      date: "October 15, 2026",
      time: "10:00 AM - 01:00 PM",
      location: "Bright Minds Early Learning • San Francisco, CA",
      description: t("event1Desc"),
      category: "Open Day",
    },
    {
      id: "2",
      title: t("event2Title"),
      date: "October 22, 2026",
      time: "11:00 AM - 02:00 PM",
      location: "Creative Minds Studio • San Francisco, CA",
      description: t("event2Desc"),
      category: "Festival",
    },
    {
      id: "3",
      title: t("event3Title"),
      date: "November 5, 2026",
      time: "05:00 PM - 06:30 PM",
      location: "Nature's Way Preschool • San Francisco, CA",
      description: t("event3Desc"),
      category: "Seminar",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
          <div className="lg:w-1/2 text-left space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary shadow-elevation-1">
              <Sparkles className="h-3.5 w-3.5" /> {t("communityGatherings")}
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface sm:text-4xl lg:text-5xl">
              {t("title")}
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="lg:w-1/2 w-full">
            <FamilyAnimation className="max-w-md mx-auto" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event, idx) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="card-surface p-6 flex flex-col justify-between hover:shadow-elevation-2 transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary-container/20 px-2.5 py-0.5 text-xs font-bold text-primary">
                    <Tag className="h-3 w-3" /> {event.category}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-on-surface mb-2">
                  {event.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                  {event.description}
                </p>

                <div className="space-y-2 border-t border-outline-variant pt-4 text-xs text-on-surface-variant">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-primary" /> {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-secondary" /> {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-tertiary shrink-0" /> {event.location}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-outline-variant">
                <Button size="sm" href={`/${locale}/academies`} className="w-full justify-center">
                  {t("rsvp")} <ArrowRight className="h-3.5 w-3.5 ml-1" />
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
