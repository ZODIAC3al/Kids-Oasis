"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Search, CheckCircle2, AlertCircle, FileText, Calendar, Sun, Moon } from "lucide-react";
import NavBar from "@/components/NavBar";

const mockStudents = [
  { id: "1", name: "Noah Smith", age: 4, class: "Preschool A", attendance: "Present", medicalNotes: "Mild peanut allergy" },
  { id: "2", name: "Emma Thompson", age: 3, class: "Preschool A", attendance: "Present", medicalNotes: "None" },
  { id: "3", name: "Leo Miller", age: 4, class: "Preschool A", attendance: "Absent", medicalNotes: "Asthma inhaler in bag" },
  { id: "4", name: "Sophia Martinez", age: 5, class: "Pre-K Prep", attendance: "Present", medicalNotes: "Lactose sensitive" },
];

export default function ClassRosterPage() {
  const [search, setSearch] = useState("");
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme') || localStorage.getItem('kids-oasis-theme');
      const isDark = stored === 'dark' || document.documentElement.classList.contains('dark');
      if (isDark) {
        setTheme('dark');
        document.documentElement.classList.add('dark');
      } else {
        setTheme('light');
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      localStorage.setItem('kids-oasis-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      localStorage.setItem('kids-oasis-theme', 'light');
    }
  };

  const filtered = mockStudents.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.class.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] transition-colors duration-300 pb-20">
      <NavBar />

      <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Class Roster & Student Profiles
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Daily student attendance, health alerts, and behavioral notes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl px-3.5 py-2 shadow-soft w-64">
              <Search className="h-4 w-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Search student name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-700 dark:text-white outline-none"
              />
            </div>

            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-[#4F46E5] dark:hover:text-[#818CF8] shadow-soft transition-colors"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((st) => (
            <div key={st.id} className="rounded-[24px] bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-6 shadow-soft space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{st.name}</h3>
                    <span className="text-xs font-semibold text-[#4F46E5] dark:text-[#818CF8]">{st.class} • Age {st.age}</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      st.attendance === "Present"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60"
                        : "bg-red-50 text-red-600 dark:bg-red-950/60"
                    }`}
                  >
                    {st.attendance}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  <p className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Health Notes:
                  </p>
                  <p>{st.medicalNotes}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">Daily Report Log</span>
                <button className="text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] hover:underline flex items-center gap-1">
                  <FileText className="h-3.5 w-3.5" /> Edit Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
