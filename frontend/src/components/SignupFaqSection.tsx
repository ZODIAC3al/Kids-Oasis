"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, UserCheck, Building2, GraduationCap } from "lucide-react";

export default function SignupFaqSection() {
  const [activeRole, setActiveRole] = useState<"parent" | "academy" | "teacher">("parent");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(0);

  const faqs = {
    parent: [
      {
        q: "How are nurseries and academies verified on Kids-Oasis?",
        a: "Every academy must submit commercial registration licenses, facility ownership documents, and owner national IDs. Our admin team verifies each nursery before granting approval.",
      },
      {
        q: "How does the child selection and enrollment process work?",
        a: "When you apply for a nursery, you select which of your registered children to apply for. Your request is sent to the Academy Owner, who reviews the profile and accepts or declines your application.",
      },
      {
        q: "Is tuition payment secure?",
        a: "Yes! Tuition payments are processed through Stripe with 256-bit SSL encryption. Once paid, an official printable legal contract receipt is generated for your records.",
      },
    ],
    academy: [
      {
        q: "What documents are required to register an academy?",
        a: "You must provide your Commercial Registration License, Owner National ID, and Facility Lease or Property Deed. Our System Administrator audits all documents before contract activation.",
      },
      {
        q: "How does the platform commission contract work?",
        a: "Kids-Oasis operates on a standard 10% platform commission model per paid student tuition. 90% net tuition proceeds are disbursed directly to your registered bank account.",
      },
      {
        q: "How do I accept or refuse student applications?",
        a: "From your Academy Owner Dashboard, you can review incoming student profiles, accept qualified applicants, or decline applications with automated polite qualification notes.",
      },
    ],
    teacher: [
      {
        q: "What credentials do educators need to submit?",
        a: "Educators must upload their National ID, Educator / Teaching License, and Resume (CV). Your account is submitted to your selected academy principal for team verification.",
      },
      {
        q: "How do I access my assigned class rosters?",
        a: "Once verified by the academy principal, you gain access to your Teacher Dashboard to view assigned student rosters, record daily attendance, and post learning progress.",
      },
    ],
  };

  const currentFaqs = faqs[activeRole];

  return (
    <section className="py-12 px-4 max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold">
          <HelpCircle className="w-4 h-4" /> Frequently Asked Questions
        </div>
        <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Role-Based Onboarding & Verification Answers
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Select your role to view detailed guidance on registration and verification.
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex justify-center gap-2 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit mx-auto">
        <button
          type="button"
          onClick={() => {
            setActiveRole("parent");
            setExpandedIdx(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeRole === "parent"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" /> Parents
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveRole("academy");
            setExpandedIdx(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeRole === "academy"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Building2 className="w-3.5 h-3.5" /> Academy Owners
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveRole("teacher");
            setExpandedIdx(0);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
            activeRole === "teacher"
              ? "bg-indigo-600 text-white shadow-md"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" /> Educators
        </button>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {currentFaqs.map((item, idx) => {
          const isOpen = expandedIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition shadow-sm"
            >
              <button
                type="button"
                onClick={() => setExpandedIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex justify-between items-center gap-4 font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-indigo-600 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800/80 pt-3"
                  >
                    {item.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
