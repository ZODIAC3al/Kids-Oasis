'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, Sun, Moon, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { clearCredentials } from '@/store/authSlice';
import { useTheme } from 'next-themes';
import axios from "axios";
import { API_URL } from "@/lib/config";

export default function NavBarClient() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { theme, setTheme } = useTheme();
  
  const { token, user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getDashboardPath = () => {
    if (!user) return "/login";
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'nurseryOwner' || user.role === 'academyOwner') return '/dashboard/academy';
    if (user.role === 'teacher') return '/dashboard/teacher';
    return '/dashboard/parent';
  };

  const links = [
    { label: "Home", href: "/" },
    { label: "Academies", href: "/academies" },
    { label: "About Us", href: "/about" },
    ...(user ? [{ label: "Dashboard", href: getDashboardPath() }] : [])
  ];

  const handleLogout = () => {
    const apiUrl = API_URL;
    axios
      .post(`${apiUrl}/auth/logout`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .finally(() => {
        dispatch(clearCredentials());
        localStorage.removeItem("authToken");
        router.push("/login");
      });
  };

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/en') return true;
    return pathname?.includes(href) && href !== '/';
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-[#1E293B]/95 shadow-md backdrop-blur' : 'bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm'
      }`}
    >
      <nav className="section-pad mx-auto flex max-w-7xl items-center justify-between py-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <motion.span
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5FC9E8] text-lg text-white shadow-sm"
            animate={{ rotate: [0, -8, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            🦖
          </motion.span>
          <span className="font-display text-xl font-extrabold text-[#1D2452] dark:text-white">
            Kids<span className="text-[#5FC9E8]">Oasis</span>
          </span>
        </Link>

        {/* Links list */}
        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`group relative font-display text-sm font-bold uppercase tracking-wide transition-colors ${
                  isActive(link.href) 
                    ? 'text-[#5FC9E8]' 
                    : 'text-[#1D2452]/80 dark:text-slate-205 hover:text-[#5FC9E8]'
                }`}
              >
                {link.label}
                <span className={`absolute -bottom-1 left-0 h-0.5 w-0 bg-[#5FC9E8] transition-all duration-300 group-hover:w-full ${
                  isActive(link.href) ? 'w-full' : ''
                }`} />
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Controls */}
        <div className="hidden items-center gap-4 lg:flex">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FDF6EC] dark:bg-slate-800 text-[#1D2452] dark:text-white transition-transform hover:-translate-y-0.5"
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} />}
          </button>

          {/* User state */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full text-xs font-bold shadow-sm"
              >
                <User size={14} className="text-[#5FC9E8]" />
                <span>Profile ({user.firstName})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex h-9 w-9 items-center justify-center bg-red-50 hover:bg-red-100 text-red-500 rounded-full shadow-sm transition-colors"
                aria-label="Sign Out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border-2 border-[#1D2452] dark:border-white text-[#1D2452] dark:text-white hover:bg-[#1D2452] dark:hover:bg-white hover:text-white dark:hover:text-navy text-xs font-extrabold transition-all"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 rounded-full bg-[#FF6F5E] text-white text-xs font-extrabold shadow-[0_3px_0_0_#e85a49] hover:translate-y-[1px] transition-all"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF6EC] dark:bg-slate-800 text-[#1D2452] dark:text-white"
            aria-label="Toggle theme"
          >
            {mounted && theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} />}
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FDF6EC] dark:bg-slate-800 text-[#1D2452] dark:text-white"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 lg:hidden"
          >
            <ul className="section-pad flex flex-col gap-1 py-4">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-3 font-display font-bold text-navy dark:text-white transition-colors hover:bg-[#FDF6EC] dark:hover:bg-slate-800"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user ? (
                <>
                  <li>
                    <Link
                      href="/profile"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-3 font-display font-bold text-slate-700 dark:text-white transition-colors hover:bg-[#FDF6EC] dark:hover:bg-slate-800"
                    >
                      My Profile ({user.firstName})
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left block rounded-xl px-3 py-3 font-display font-bold text-red-500 transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      Sign Out
                    </button>
                  </li>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 mt-2 px-3">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl border-2 border-[#1D2452] dark:border-white text-[#1D2452] dark:text-white text-xs font-bold"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-center py-2.5 rounded-xl bg-[#FF6F5E] text-white text-xs font-bold"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
