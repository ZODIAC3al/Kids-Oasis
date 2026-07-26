'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Compass, Star, Heart, SlidersHorizontal } from 'lucide-react';
import NavBar from '@/components/NavBar';

// Mock list
const mapAcademies = [
  { id: 1, name: 'Blossom Kids', location: 'Smouha, Alexandria', rate: 4.9, price: '1,500 EGP', travelTime: '8 mins drive' },
  { id: 2, name: 'Growing Minds', location: 'San Stefano, Alexandria', rate: 4.7, price: '1,400 EGP', travelTime: '15 mins drive' }
];

export default function SplitMapDiscovery() {
  const [selectedPin, setSelectedPin] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] pb-10 transition-colors duration-300">
      <NavBar />

      <div className="grid grid-cols-1 lg:grid-cols-5 h-[calc(100vh-80px)] overflow-hidden">
        {/* LEFT: Directory Listings List */}
        <div className="lg:col-span-2 overflow-y-auto p-6 space-y-6 border-r border-slate-100 dark:border-slate-800">
          <div className="space-y-4">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Map Discovery</h1>
            <p className="text-xs text-slate-400">Discover and compare nursery locations side-by-side with travel details.</p>
          </div>

          <div className="space-y-4">
            {mapAcademies.map((ac) => {
              const isSelected = selectedPin === ac.id;
              return (
                <div
                  key={ac.id}
                  onClick={() => setSelectedPin(ac.id)}
                  className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer relative flex flex-col justify-between h-40 ${
                    isSelected
                      ? "border-[#4F46E5] bg-[#4F46E5]/5 dark:bg-[#4F46E5]/10 shadow-soft"
                      : "border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1E293B] hover:border-slate-200"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-800 dark:text-white text-base">{ac.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 py-0.5 px-2 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>{ac.rate}</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#4F46E5]" /> {ac.location}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-50 dark:border-slate-800/80 text-xs">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Navigation className="w-3.5 h-3.5 text-[#0EA5E9]" />
                      <span className="font-semibold">{ac.travelTime}</span>
                    </div>
                    <span className="font-extrabold text-[#4F46E5] dark:text-[#0EA5E9] text-sm">{ac.price} / mo</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT: Visual map overlay */}
        <div className="lg:col-span-3 bg-slate-100 dark:bg-slate-900 relative">
          {/* Map canvas container */}
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200/50 dark:bg-slate-950/20">
            {/* Mock map outline marker pins */}
            <div className="relative w-full h-full bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] dark:bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
              
              {/* Pin 1 */}
              <motion.div
                onClick={() => setSelectedPin(1)}
                whileHover={{ scale: 1.1 }}
                className="absolute top-1/3 left-1/3 cursor-pointer group"
              >
                <div className={`py-1.5 px-3 rounded-full text-xs font-bold shadow-soft flex items-center gap-1.5 border transition-all ${
                  selectedPin === 1
                    ? "bg-[#4F46E5] text-white border-[#4F46E5] scale-110"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200"
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Blossom Kids</span>
                </div>
              </motion.div>

              {/* Pin 2 */}
              <motion.div
                onClick={() => setSelectedPin(2)}
                whileHover={{ scale: 1.1 }}
                className="absolute top-1/2 left-2/3 cursor-pointer group"
              >
                <div className={`py-1.5 px-3 rounded-full text-xs font-bold shadow-soft flex items-center gap-1.5 border transition-all ${
                  selectedPin === 2
                    ? "bg-[#4F46E5] text-white border-[#4F46E5] scale-110"
                    : "bg-white dark:bg-slate-800 text-slate-800 dark:text-white border-slate-200"
                }`}>
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Growing Minds</span>
                </div>
              </motion.div>

              {/* Cluster coordinates mock */}
              <div className="absolute top-10 left-10 p-3 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-soft text-[10px] font-bold text-slate-500 dark:text-slate-350 border border-slate-200/50">
                📍 Alexandria Center Map View
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
