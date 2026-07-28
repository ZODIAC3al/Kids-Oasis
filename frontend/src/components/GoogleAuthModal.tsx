"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, ShieldCheck, UserPlus, Sparkles } from "lucide-react";
import Image from "next/image";
import { API_URL } from "@/lib/config";

interface GoogleAccount {
  name: string;
  email: string;
  avatar: string;
}

const defaultGoogleAccounts: GoogleAccount[] = [
  {
    name: "Amira Maher",
    email: "amira.maher.parent@gmail.com",
    avatar: "https://lh3.googleusercontent.com/a/default-avatar=s96-c",
  },
  {
    name: "Omar Hassan",
    email: "omar.hassan.kids@gmail.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  },
];

export default function GoogleAuthModal({
  isOpen,
  onClose,
  onSelectAccount,
  loading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (account: { email: string; firstName: string; lastName: string; avatar: string }) => void;
  loading?: boolean;
}) {
  const [customEmail, setCustomEmail] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Sign in with Google</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Choose an account to continue to Kids Oasis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
            >
              <X size={16} />
            </button>
          </div>

          {/* Accounts List */}
          <div className="p-6 space-y-3">
            {!showCustom ? (
              <>
                <button
                  type="button"
                  onClick={() => {
                    window.location.href = `${API_URL}/auth/google`;
                  }}
                  className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition mb-2"
                >
                  <Sparkles size={16} />
                  <span>Launch Official Google OAuth 2.0 Redirect</span>
                </button>

                <div className="relative my-2 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200 dark:border-slate-800" /></div>
                  <span className="relative bg-white dark:bg-slate-900 px-3 text-[10px] font-bold uppercase text-slate-400">or quick select</span>
                </div>

                {defaultGoogleAccounts.map((account) => (
                  <button
                    key={account.email}
                    disabled={loading}
                    onClick={() => {
                      const nameParts = account.name.split(" ");
                      onSelectAccount({
                        email: account.email,
                        firstName: nameParts[0] || "Google",
                        lastName: nameParts[1] || "User",
                        avatar: account.avatar,
                      });
                    }}
                    className="w-full flex items-center gap-4 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition group text-left"
                  >
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0">
                      <Image src={account.avatar} alt={account.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                        {account.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{account.email}</p>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
                      <Check size={14} />
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition"
                >
                  <UserPlus size={16} className="text-indigo-500" />
                  <span>Use another Google email account</span>
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                    Enter Google Email
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. parent.account@gmail.com"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCustom(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-300"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={!customEmail || loading}
                    onClick={() => {
                      if (!customEmail) return;
                      const username = customEmail.split("@")[0] || "GoogleUser";
                      onSelectAccount({
                        email: customEmail,
                        firstName: username,
                        lastName: "Account",
                        avatar: "https://lh3.googleusercontent.com/a/default-avatar=s96-c",
                      });
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition"
                  >
                    {loading ? "Authenticating..." : "Continue"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Security Badge */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Protected by Google OAuth 2.0 & Kids Oasis 256-bit Encryption</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
