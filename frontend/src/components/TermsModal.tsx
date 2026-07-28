"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, FileText, CheckCircle2, Lock } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8"
        >
          {/* Modal Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/10 border border-white/20">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">
                  Kids-Oasis Terms of Service & Child Protection Policy
                </h3>
                <p className="text-xs text-indigo-200">
                  Updated for Academic Year 2026 • Platform Governance Code
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 dark:text-slate-300 overflow-y-auto max-h-[65vh]">
            <div className="space-y-2">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 1. Platform Role Governance & Verification Audit
              </h4>
              <p className="leading-relaxed">
                All registered Academy Owners, Nursery Principals, and Educators are subject to mandatory identity verification, commercial licensing audit, and background checks conducted by Kids-Oasis System Administrators before receiving platform activation.
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> 2. Child Protection & Privacy Guarantee
              </h4>
              <p className="leading-relaxed">
                Kids-Oasis enforces strict confidentiality over child profiles, health records, medical notes, and photos. Child data is stored with end-to-end encryption and is strictly restricted to authorized parents and designated academy educators.
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" /> 3. Platform Partner Commission Contract
              </h4>
              <p className="leading-relaxed">
                Academy Owners operating on the platform agree to a standard 10% platform commission schedule on paid student tuition settlements. Net tuition proceeds (90%) are disbursed to the academy’s registered bank account upon enrollment authorization.
              </p>
            </div>

            <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="font-extrabold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" /> 4. Financial Settlements & Cancellation Policies
              </h4>
              <p className="leading-relaxed">
                All tuition payments processed via Stripe are subject to verification. Refunds or enrollment transfers are managed in accordance with the specific nursery’s cancellation policy as approved during onboarding.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="p-5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition"
            >
              I Understand & Agree
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
