"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Star, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { DollClawAnimation } from "@/components/ui/lottie-animations";

const compareItems = [
  {
    id: "1",
    name: "Lighthouse Early Learning",
    curriculum: "STEM & Reggio Emilia",
    rating: 4.9,
    reviews: 128,
    price: 1200,
    minAge: 2,
    maxAge: 5,
    transportation: true,
    mealsIncluded: true,
    stemLab: true,
    outdoorPlay: true,
    languages: ["English", "Spanish"],
  },
  {
    id: "2",
    name: "Nature's Way Preschool",
    curriculum: "Waldorf & Outdoor",
    rating: 4.7,
    reviews: 84,
    price: 950,
    minAge: 3,
    maxAge: 6,
    transportation: false,
    mealsIncluded: true,
    stemLab: false,
    outdoorPlay: true,
    languages: ["English"],
  },
  {
    id: "3",
    name: "Creative Minds Studio",
    curriculum: "Montessori & Dual Language",
    rating: 5.0,
    reviews: 210,
    price: 1450,
    minAge: 2,
    maxAge: 8,
    transportation: true,
    mealsIncluded: false,
    stemLab: true,
    outdoorPlay: true,
    languages: ["English", "French", "Mandarin"],
  },
];

export default function CompareAcademiesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12">
        <div className="flex flex-col lg:flex-row items-center gap-8 mb-12">
          <div className="lg:w-2/3 text-left space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary shadow-elevation-1">
              <Sparkles className="h-3.5 w-3.5" /> Side-by-Side Comparison
            </span>
            <h1 className="font-display text-3xl font-bold text-on-surface sm:text-4xl lg:text-5xl">
              Compare Top Academies
            </h1>
            <p className="text-base text-on-surface-variant leading-relaxed">
              Evaluate curricula, monthly fees, age bounds, and facility features side-by-side to choose the best environment for your child.
            </p>
          </div>

          <div className="lg:w-1/3 w-full">
            <DollClawAnimation className="max-w-[260px] mx-auto" />
          </div>
        </div>

        <div className="overflow-x-auto pb-6">
          <table className="w-full min-w-[700px] border-collapse card-surface shadow-elevation-2 overflow-hidden">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container-low">
                <th className="p-4 text-left font-display text-sm font-bold text-on-surface w-1/4">
                  Feature / Criteria
                </th>
                {compareItems.map((ac) => (
                  <th key={ac.id} className="p-4 text-center w-1/4">
                    <h3 className="font-display text-base font-bold text-on-surface">{ac.name}</h3>
                    <p className="text-xs text-primary font-semibold mt-1">{ac.curriculum}</p>
                    <div className="mt-3">
                      <Button size="sm" href={`/academies/${ac.id}`}>
                        View Details
                      </Button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant text-sm">
              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Monthly Fee</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center font-display text-base font-bold text-primary">
                    ${ac.price} / mo
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Rating & Reviews</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-on-surface">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      {ac.rating} ({ac.reviews})
                    </span>
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Age Range</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center text-xs font-medium text-on-surface">
                    {ac.minAge} - {ac.maxAge} Years
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Languages Offered</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center text-xs text-on-surface">
                    {ac.languages.join(", ")}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Transportation</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center">
                    {ac.transportation ? (
                      <Check className="h-5 w-5 text-tertiary mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-error opacity-40 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Organic Meals</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center">
                    {ac.mealsIncluded ? (
                      <Check className="h-5 w-5 text-tertiary mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-error opacity-40 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">STEM Lab & Robotics</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center">
                    {ac.stemLab ? (
                      <Check className="h-5 w-5 text-tertiary mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-error opacity-40 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>

              <tr>
                <td className="p-4 font-semibold text-on-surface-variant">Outdoor Play Grounds</td>
                {compareItems.map((ac) => (
                  <td key={ac.id} className="p-4 text-center">
                    {ac.outdoorPlay ? (
                      <Check className="h-5 w-5 text-tertiary mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-error opacity-40 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
}
