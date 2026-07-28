'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Calendar, DollarSign, Award, Bell, Shield, MapPin, Heart, MessageSquare,
  Settings, LogOut, FileText, ChevronRight, ChevronLeft, RefreshCw, Eye,
  Home, Search, Sun, Moon, Download, Plus, Users, Sparkles, Clock, Check,
  TrendingUp, GraduationCap, CalendarDays, CreditCard, CheckCircle2
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import PaymentModal from '@/components/PaymentModal';
import ReceiptModal from '@/components/ReceiptModal';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { RootState } from '@/store/store';
import apiClient from '@/lib/axios';
import axios from 'axios';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

/* ---------------------------------------------------------
   Small shared pieces
--------------------------------------------------------- */

function RingProgress({
  percent,
  colorClass,
  trackClass = 'text-slate-150 dark:text-slate-800',
  size = 84,
  stroke = 9,
}: {
  percent: number;
  colorClass: string;
  trackClass?: string;
  size?: number;
  stroke?: number;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, percent));
  const offset = circumference - (clamped / 100) * circumference;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        fill="none"
        className={trackClass}
        stroke="currentColor"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        className={colorClass}
        stroke="currentColor"
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
    </svg>
  );
}

function MiniCalendar({ highlightDate }: { highlightDate: Date | null }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [cursor]);

  const isSameDay = (day: number) => {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    return (
      highlightDate &&
      d.getFullYear() === highlightDate.getFullYear() &&
      d.getMonth() === highlightDate.getMonth() &&
      d.getDate() === highlightDate.getDate()
    );
  };

  const isToday = (day: number) => {
    const d = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
          {cursor.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
        <div className="flex gap-1">
          <button
            aria-label="Previous month"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            aria-label="Next month"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-1.5 text-center">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <span key={i} className="text-[10px] font-bold text-slate-350 dark:text-slate-500">
            {d}
          </span>
        ))}
        {days.map((day, i) => (
          <div key={i} className="flex items-center justify-center h-7">
            {day && (
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold ${isSameDay(day)
                  ? 'bg-[#4F46E5] text-white'
                  : isToday(day)
                    ? 'border border-[#4F46E5] text-[#4F46E5] dark:text-[#818CF8]'
                    : 'text-slate-600 dark:text-slate-400'
                  }`}
              >
                {day}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------
   Main dashboard
--------------------------------------------------------- */

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const locale = useLocale();

  const { token, user } = useSelector((state: RootState) => state.auth);

  const [children, setChildren] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payModalData, setPayModalData] = useState<{
    academyName: string;
    programName: string;
    amount: number;
    academyId: string;
    enrollmentId?: string;
  } | null>(null);

  const [selectedReceipt, setSelectedReceipt] = useState<any>(null);

  const handleOpenReceipt = (enroll: any) => {
    const parentFullName = user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'Valued Parent';
    const childName = enroll.childId?.name || enroll.childName || 'Enrolled Student';
    const academyName = enroll.academyId?.name || 'Oasis Academy Partner';
    const amount = enroll.fee || enroll.programId?.price || 1800;

    setSelectedReceipt({
      receiptId: `REC-2026-${(enroll._id || '9876').slice(-4).toUpperCase()}`,
      parentName: parentFullName,
      parentEmail: user?.email || 'parent@kidsoasis.com',
      childName,
      academyName,
      programName: enroll.programId?.name || enroll.programName || 'Preschool Class',
      amount,
      paymentMethod: 'Stripe Card',
      paidAt: enroll.updatedAt ? new Date(enroll.updatedAt).toLocaleDateString() : new Date().toLocaleDateString(),
      transactionRef: `ch_stripe_${(enroll._id || 'tx98').slice(-6)}`,
    });
  };


  const handleOpenPayModal = (enroll: any) => {
    setPayModalData({
      academyName: enroll.academyId?.name || 'Partner Academy',
      programName: enroll.programId?.name || enroll.programName || 'Preschool Class',
      amount: enroll.fee || enroll.programId?.price || enroll.price || 1800,
      academyId: enroll.academyId?._id || enroll.academyId || 'academy_1',
      enrollmentId: enroll._id,
    });
    setPayModalOpen(true);
  };

  /* Theme bootstrap */
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

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const childrenRes = await apiClient.get('/children');
      setChildren(childrenRes.data || []);

      const bookingsRes = await apiClient.get('/bookings');
      setBookings(bookingsRes.data || []);

      const enrollmentsRes = await apiClient.get('/enrollments');
      setEnrollments(enrollmentsRes.data || []);

      const primaryChild = childrenRes.data?.[0];
      if (primaryChild?._id) {
        const recsRes = await apiClient.get(`/children/${primaryChild._id}/recommendations`);
        setRecommendations(recsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to query backend records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    } else if (user.role !== 'parent' && user.role !== 'admin') {
      router.push(`/${locale}`);
      return;
    }
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, router, locale]);

  /* ---------------- Derived data ---------------- */

  const sortedBookings = useMemo(
    () => [...bookings].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [bookings]
  );

  const notificationItems = useMemo(() => {
    const items: { title: string; subtitle: string; tone: string }[] = [];
    bookings.slice(0, 2).forEach((b) =>
      items.push({
        title: `Visit ${b.status || 'Pending'}`,
        subtitle: `${b.academyId?.name || 'Academy partner'} • ${b.date ? new Date(b.date).toLocaleDateString() : 'date TBD'
          }`,
        tone: b.status === 'Confirmed' ? 'accent' : 'warning',
      })
    );
    enrollments.slice(0, 2).forEach((e) =>
      items.push({
        title: `Application ${e.status || 'Pending'}`,
        subtitle: e.academyId?.name || 'Academy partner',
        tone: e.status === 'Accepted' || e.status === 'Enrolled' ? 'accent' : 'secondary',
      })
    );
    return items.slice(0, 4);
  }, [bookings, enrollments]);

  if (!user || (user.role !== 'parent' && user.role !== 'admin')) {
    return null;
  }

  const activeChildrenCount = children.length;
  const upcomingVisitsCount = bookings.filter((b) => b.status === 'Confirmed' || b.status === 'Pending').length;
  const unpaidInvoicesCount = enrollments.filter((e) => e.status === 'Pending').length;

  const now = new Date();
  const nextBooking = sortedBookings.find((b) => new Date(b.date) >= now) || sortedBookings[0] || null;
  const nextBookingDate = nextBooking?.date ? new Date(nextBooking.date) : null;

  const confirmedCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const attendanceRate = bookings.length ? Math.round((confirmedCount / bookings.length) * 100) : 0;

  const paidCount = enrollments.filter((e) => e.status === 'Accepted' || e.status === 'Enrolled').length;
  const paymentsRate = enrollments.length ? Math.round((paidCount / enrollments.length) * 100) : 0;

  const childCompleteness = (child: any) => {
    const fields = [child.name, child.birthday, child.gender, child.allergies, child.medicalNotes];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  };

  const railTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-[18px] h-[18px]" /> },
    { id: 'children', label: 'My Children', icon: <Heart className="w-[18px] h-[18px]" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-[18px] h-[18px]" /> },
    { id: 'payments', label: 'Payments', icon: <DollarSign className="w-[18px] h-[18px]" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const tabPills = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'children', label: 'My Children' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'payments', label: 'Payments & Applications' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] transition-colors duration-300 pb-24 lg:pb-10">
      <NavBar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6 lg:mt-10 flex gap-6">
        {/* ------------------------------------------------------------------ */}
        {/* Icon rail — desktop only, app-level navigation                     */}
        {/* ------------------------------------------------------------------ */}
        <aside className="hidden lg:flex flex-col items-center gap-2 w-16 shrink-0 py-4 sticky top-6 h-fit rounded-[24px] bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-soft">
          {railTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                aria-label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ${isSelected
                  ? 'bg-[#4F46E5] text-white shadow-soft'
                  : 'text-slate-400 hover:text-[#4F46E5] hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
              >
                {tab.icon}
              </button>
            );
          })}
          <div className="flex-1" />
          <button
            aria-label="Log out"
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-350 hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </aside>

        {/* ------------------------------------------------------------------ */}
        {/* Main column                                                        */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Top bar: tabs + search + theme + actions */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
              {tabPills.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${isSelected
                      ? 'bg-white dark:bg-[#1E293B] text-[#4F46E5] dark:text-[#818CF8] shadow-soft'
                      : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                      }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-2 shadow-soft w-40 md:w-56">
                <Search className="w-4 h-4 text-slate-350 shrink-0" />
                <input
                  type="text"
                  placeholder="Search or type command"
                  className="bg-transparent outline-none text-xs text-slate-600 dark:text-slate-300 placeholder:text-slate-350 w-full"
                />
              </div>

              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="relative flex items-center bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-full p-1 w-16 h-9 shadow-soft shrink-0"
              >
                <span
                  className={`absolute top-1 left-1 w-7 h-7 rounded-full bg-[#4F46E5] flex items-center justify-center transition-transform duration-200 ${theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                    }`}
                >
                  {theme === 'dark' ? (
                    <Moon className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Sun className="w-3.5 h-3.5 text-white" />
                  )}
                </span>
              </button>

              <button
                aria-label="Notifications"
                className="relative w-9 h-9 flex items-center justify-center rounded-full bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-soft text-slate-500 dark:text-slate-300 shrink-0"
              >
                <Bell className="w-4 h-4" />
                {notificationItems.length > 0 && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                )}
              </button>

              <button className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shrink-0">
                <Download className="w-3.5 h-3.5" /> Export data
              </button>

              <button
                onClick={() => router.push('/academies')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#4F46E5] text-white text-xs font-bold shadow-soft shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Book a visit
              </button>
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#4F46E5] animate-spin" />
              <p className="text-sm font-semibold text-slate-450">Synchronizing profiles with database...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              {activeTab === 'dashboard' && (
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Greeting + illustrative feature cards */}
                  <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_repeat(3,minmax(0,180px))] gap-4 items-stretch">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
                        Hi, {user.firstName}! <span className="inline-block">👋</span>
                        <br className="hidden sm:block" /> What's on the plan today?
                      </h1>
                      <p className="text-sm text-slate-400 mt-2 max-w-md">
                        This is a real-time summary of your child profiles, visits and applications across Kids
                        Oasis.
                      </p>
                    </div>

                    <button
                      onClick={() => router.push('/onboarding')}
                      className="hidden xl:flex flex-col items-center justify-center rounded-[20px] bg-[#4F46E5] text-white shadow-soft aspect-square hover:brightness-110 transition"
                    >
                      <Plus className="w-6 h-6" />
                    </button>

                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-4 shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                      <GraduationCap className="w-6 h-6 text-[#4F46E5]" />
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-white">Stay organized</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Track every child's journey</p>
                      </div>
                    </div>

                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-4 shadow-soft border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                      <RefreshCw className="w-6 h-6 text-[#0EA5E9]" />
                      <div>
                        <p className="text-xs font-bold text-slate-700 dark:text-white">Sync your visits</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">Always up to date</p>
                      </div>
                    </div>
                  </div>

                  {/* Recharts Analytics Section */}
                  <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 shadow-soft border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">Children Learning & Attendance Progress</h3>
                        <p className="text-xs text-slate-400">Track monthly activity hours and academy attendance rate.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">{attendanceRate || 94}% Attendance Rate</span>
                    </div>

                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { month: 'Jan', attendance: 85, activities: 12 },
                          { month: 'Feb', attendance: 88, activities: 16 },
                          { month: 'Mar', attendance: 92, activities: 20 },
                          { month: 'Apr', attendance: 90, activities: 24 },
                          { month: 'May', attendance: attendanceRate || 95, activities: (children.length * 8) || 28 },
                          { month: 'Jun', attendance: 98, activities: 32 },
                        ]}>
                          <defs>
                            <linearGradient id="parentColor" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.35}/>
                              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="attendance" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#parentColor)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Notifications / Assignments / Calendar row */}
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {/* Notifications */}
                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                        <button className="text-[11px] font-semibold text-slate-400 hover:text-[#4F46E5]">
                          Clear
                        </button>
                      </div>
                      <div className="space-y-3">
                        {notificationItems.length > 0 ? (
                          notificationItems.map((n, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                            >
                              <span
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${n.tone === 'accent'
                                  ? 'bg-[#10B981]/10 text-[#10B981]'
                                  : n.tone === 'warning'
                                    ? 'bg-[#F59E0B]/10 text-[#F59E0B]'
                                    : 'bg-[#0EA5E9]/10 text-[#0EA5E9]'
                                  }`}
                              >
                                <Bell className="w-4 h-4" />
                              </span>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                  {n.title}
                                </p>
                                <p className="text-[11px] text-slate-400 truncate">{n.subtitle}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-[11px] text-slate-400 py-4 text-center">
                            No notifications yet — book a visit to get started.
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Assignments -> Applications */}
                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Applications</h3>
                        <button className="text-[11px] font-semibold text-slate-400 hover:text-[#4F46E5]">Edit</button>
                      </div>
                      {enrollments[0] ? (
                        <div className="space-y-3">
                          <div>
                            <span className="text-[11px] font-semibold text-slate-400">
                              {enrollments[0].academyId?.name || 'Academy partner'}
                            </span>
                            <p className="text-sm font-bold text-slate-800 dark:text-white mt-0.5">
                              {enrollments[0].programId?.name || 'Preschool program'}
                            </p>
                          </div>
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${enrollments[0].status === 'Accepted' || enrollments[0].status === 'Enrolled'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                              }`}
                          >
                            {enrollments[0].status || 'Pending'}
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-400 py-2">No applications submitted yet.</p>
                      )}
                      <button
                        onClick={() => router.push('/academies')}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#FAFAFC] dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:border-[#4F46E5] hover:text-[#4F46E5] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" /> New application
                      </button>
                    </div>

                    {/* Calendar */}
                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 md:col-span-2 xl:col-span-1">
                      <MiniCalendar highlightDate={nextBookingDate} />
                      {nextBooking && (
                        <div className="mt-4 flex items-center gap-3 p-3 rounded-xl bg-[#FAFAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <Clock className="w-4 h-4 text-[#4F46E5] shrink-0" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                              {nextBooking.academyId?.name || 'Academy visit'}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {nextBookingDate?.toLocaleDateString()} • {nextBooking.time || '10:00 AM'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Today's tasks (children progress) + Premium CTA */}
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                    <div className="xl:col-span-2 rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Child profiles</h3>
                        <button
                          onClick={() => setActiveTab('children')}
                          className="text-[11px] font-semibold text-slate-400 hover:text-[#4F46E5]"
                        >
                          View all
                        </button>
                      </div>
                      {children.length > 0 ? (
                        <div className="space-y-3">
                          {children.slice(0, 4).map((child, i) => {
                            const pct = childCompleteness(child);
                            return (
                              <div
                                key={i}
                                className="flex items-center justify-between gap-4 p-3 rounded-xl bg-[#FAFAFC] dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-9 h-9 rounded-full bg-[#4F46E5]/10 text-[#4F46E5] flex items-center justify-center text-xs font-bold shrink-0">
                                    {child.name ? child.name.charAt(0).toUpperCase() : 'C'}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
                                      {child.name || 'Unnamed child'}
                                    </p>
                                    <p className="text-[11px] text-slate-400">Profile completeness</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 w-28 sm:w-36 shrink-0">
                                  <div className="flex-1 h-1.5 rounded-full bg-slate-150 dark:bg-slate-800 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-[#10B981]"
                                      style={{ width: `${pct}%` }}
                                    />
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 w-8 text-right">
                                    {pct}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                          <p className="text-xs text-slate-400">No child profiles yet — add one to get started.</p>
                        </div>
                      )}
                    </div>

                    <div className="rounded-[20px] bg-gradient-to-br from-[#4F46E5] to-[#4338CA] p-6 shadow-soft flex flex-col justify-between text-white">
                      <Sparkles className="w-6 h-6" />
                      <div className="space-y-1 mt-6">
                        <h4 className="text-base font-bold">Discover more academies</h4>
                        <p className="text-xs text-white/80">
                          Get AI-matched recommendations tailored to your child's age and interests.
                        </p>
                      </div>
                      <button
                        onClick={() => router.push('/academies')}
                        className="mt-4 w-full py-2.5 rounded-xl bg-white text-[#4F46E5] text-xs font-bold hover:bg-white/90 transition-colors"
                      >
                        Find out more
                      </button>
                    </div>
                  </div>

                  {/* Rings + upcoming visit detail */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <RingProgress percent={attendanceRate} colorClass="text-[#10B981]" size={72} stroke={7} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-800 dark:text-white">
                          {attendanceRate}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Visit confirmation</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {confirmedCount} of {bookings.length || 0} visits confirmed
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div className="relative shrink-0">
                        <RingProgress percent={paymentsRate} colorClass="text-[#0EA5E9]" size={72} stroke={7} />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-slate-800 dark:text-white">
                          {paymentsRate}%
                        </span>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Enrollment progress</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {paidCount} of {enrollments.length || 0} applications accepted
                        </p>
                      </div>
                    </div>

                    <div className="rounded-[20px] bg-white dark:bg-[#1E293B] p-5 shadow-soft border border-slate-100 dark:border-slate-800 sm:col-span-2 xl:col-span-1">
                      {nextBooking ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Upcoming visit</h4>
                            <CalendarDays className="w-4 h-4 text-[#4F46E5]" />
                          </div>
                          <p className="text-sm font-bold text-slate-800 dark:text-white">
                            {nextBooking.academyId?.name || 'Academy partner'}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {nextBooking.academyId?.address || 'Alexandria'} •{' '}
                            {nextBookingDate?.toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 pt-1">
                            <button className="flex-1 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                              Reschedule
                            </button>
                            <button className="flex-1 py-2 rounded-lg bg-[#4F46E5] text-white text-[11px] font-bold hover:brightness-110 transition-all flex items-center justify-center gap-1">
                              <Check className="w-3 h-3" /> Confirm
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center py-4 gap-2">
                          <TrendingUp className="w-6 h-6 text-slate-300" />
                          <p className="text-[11px] text-slate-400">No upcoming visits scheduled.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Overview stat cards (kept from original, restyled) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        label: 'Registered children',
                        value: `${activeChildrenCount}`,
                        icon: <Heart className="text-[#4F46E5]" />,
                      },
                      {
                        label: 'Upcoming visits',
                        value: `${upcomingVisitsCount}`,
                        icon: <Calendar className="text-[#0EA5E9]" />,
                      },
                      {
                        label: 'Unpaid invoices',
                        value: `${unpaidInvoicesCount}`,
                        icon: <DollarSign className="text-[#10B981]" />,
                      },
                    ].map((card, i) => (
                      <div
                        key={i}
                        className="bg-white dark:bg-[#1E293B] rounded-[20px] shadow-soft p-5 border border-slate-100 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {card.label}
                          </span>
                          <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">{card.value}</h4>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800">{card.icon}</div>
                      </div>
                    ))}
                  </div>

                  {/* AI Recommendations */}
                  <div className="bg-gradient-to-r from-[#4F46E5]/10 to-[#0EA5E9]/10 rounded-[20px] p-6 border border-[#4F46E5]/10 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#4F46E5] dark:text-[#818CF8] flex items-center gap-1.5">
                        <Award className="w-5 h-5" /> AI recommendations
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Tailored suggestions from verified local providers matching your child's preferences and
                        regional budget.
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendations.length > 0 ? (
                        recommendations.map((rec, i) => (
                          <div
                            key={i}
                            className="bg-white dark:bg-[#1E293B] p-4 rounded-xl shadow-soft border border-slate-100 dark:border-slate-800 flex justify-between items-center"
                          >
                            <div className="space-y-1 min-w-0">
                              <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                                {rec.name}
                              </h4>
                              <p className="text-xs text-slate-400 flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#4F46E5]" /> {rec.address || 'Alexandria'} • EGP{' '}
                                {rec.branches?.[0]?.programs?.[0]?.price || '1,200'}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 py-1 px-2.5 rounded-full shrink-0">
                              98% match
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-1 md:col-span-2 text-center py-4 bg-white/50 dark:bg-[#1E293B]/50 rounded-xl">
                          <p className="text-xs text-slate-400">
                            No matched academies yet. Add a child profile to get AI matches.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'children' && (
                <motion.div
                  key="children"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">My children</h2>
                    <button
                      onClick={() => router.push(`/${locale}/onboarding`)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-soft"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add child
                    </button>
                  </div>
                  {children.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {children.map((child, i) => (
                        <div
                          key={i}
                          className="bg-white dark:bg-[#1E293B] p-6 rounded-[20px] shadow-soft border border-slate-100 dark:border-slate-800 space-y-4"
                        >
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{child.name}</h4>
                            <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full text-xs font-bold uppercase">
                              {child.gender}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-xs">
                            <div>
                              <span className="text-slate-400 block font-semibold">Allergies</span>
                              <span className="font-bold text-slate-700 dark:text-white">
                                {child.allergies || 'None'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Medical note / blood</span>
                              <span className="font-bold text-slate-700 dark:text-white">
                                {child.medicalNotes || 'O+'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Birth date</span>
                              <span className="font-bold text-[#4F46E5] dark:text-[#818CF8]">
                                {child.birthday ? new Date(child.birthday).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div>
                              <span className="text-slate-400 block font-semibold">Verification</span>
                              <span className="font-bold text-[#10B981]">Active</span>
                            </div>
                          </div>
                          {child.interests && child.interests.length > 0 && (
                            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                              <span className="text-slate-400 block text-[11px] font-semibold mb-1.5">Interests & Skill Focus</span>
                              <div className="flex flex-wrap gap-1.5">
                                {child.interests.map((interest: string, idx: number) => (
                                  <span key={idx} className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-[#818CF8] text-[10px] font-bold rounded-md">
                                    {interest}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-[20px] space-y-3">
                      <p className="text-slate-400 text-sm">No child profile records found.</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'bookings' && (
                <motion.div
                  key="bookings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Booked visits & programs</h2>
                  <div className="bg-white dark:bg-[#1E293B] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm min-w-[520px]">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Academy</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Date</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Time</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.length > 0 ? (
                          bookings.map((booking, i) => (
                            <tr key={i} className="border-b border-slate-50 dark:border-slate-800/80">
                              <td className="p-4 font-bold text-slate-900 dark:text-white">
                                {booking.academyId?.name || 'Academy partner'}
                              </td>
                              <td className="p-4 text-slate-500 dark:text-slate-400">
                                {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="p-4 text-slate-500 dark:text-slate-400">{booking.time || '10:00 AM'}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${booking.status === 'Confirmed'
                                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                    : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                    }`}
                                >
                                  {booking.status || 'Pending'}
                                </span>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold">
                              No visit bookings found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'payments' && (
                <motion.div
                  key="payments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Enrollment applications & invoices
                  </h2>
                  <div className="bg-white dark:bg-[#1E293B] rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm min-w-[620px]">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-800">
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Academy</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Student</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Program</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Tuition</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Status</th>
                          <th className="p-4 font-bold text-slate-600 dark:text-slate-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {enrollments.length > 0 ? (
                          enrollments.map((enroll, i) => {
                            const childName = enroll.childId?.name || enroll.childName || 'Child Applicant';
                            const isPaid = enroll.isPaid || enroll.status === 'Enrolled' || enroll.status === 'Paid';
                            const isAccepted = enroll.status === 'Accepted' || enroll.status === 'Approved';
                            const isDeclined = enroll.status === 'Declined' || enroll.status === 'Rejected';

                            return (
                              <tr key={i} className="border-b border-slate-50 dark:border-slate-800/80">
                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                  {enroll.academyId?.name || 'Academy partner'}
                                </td>
                                <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">
                                  {childName}
                                </td>
                                <td className="p-4 text-slate-500 dark:text-slate-400 text-xs">
                                  {enroll.programId?.name || enroll.programName || 'Preschool class'}
                                </td>
                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                  EGP {(enroll.fee || enroll.programId?.price || 1800).toLocaleString()}
                                </td>
                                <td className="p-4">
                                  {isPaid ? (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1 w-fit">
                                      <CheckCircle2 className="w-3.5 h-3.5" /> Enrolled & Paid
                                    </span>
                                  ) : isAccepted ? (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 flex items-center gap-1 w-fit">
                                      <Sparkles className="w-3.5 h-3.5" /> Approved - Pay Now
                                    </span>
                                  ) : isDeclined ? (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 flex items-center gap-1 w-fit">
                                      Declined
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1 w-fit">
                                      <Clock className="w-3.5 h-3.5" /> Pending Review
                                    </span>
                                  )}
                                </td>
                                <td className="p-4">
                                  {isPaid ? (
                                    <button
                                      onClick={() => handleOpenReceipt(enroll)}
                                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                                    >
                                      <Download className="w-3.5 h-3.5" /> PDF Receipt
                                    </button>
                                  ) : isAccepted ? (
                                    <button
                                      onClick={() => handleOpenPayModal(enroll)}
                                      className="px-3.5 py-1.5 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl text-xs font-bold shadow-soft transition flex items-center gap-1.5"
                                    >
                                      <CreditCard className="w-3.5 h-3.5" /> Pay Tuition
                                    </button>
                                  ) : isDeclined ? (
                                    <button
                                      onClick={() => alert("Apology Note: Current seat capacity for this program is full. We invite you to explore other recommended academies on Kids-Oasis.")}
                                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-200 transition"
                                    >
                                      View Note
                                    </button>
                                  ) : (
                                    <span className="text-xs text-slate-400 font-semibold italic">Awaiting Owner Approval</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-400 font-semibold">
                              No enrollment records or invoices found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {payModalData && (
                    <PaymentModal
                      isOpen={payModalOpen}
                      onClose={() => {
                        setPayModalOpen(false);
                        setPayModalData(null);
                      }}
                      academyName={payModalData.academyName}
                      programName={payModalData.programName}
                      amount={payModalData.amount}
                      academyId={payModalData.academyId}
                      enrollmentId={payModalData.enrollmentId}
                      onPaymentSuccess={() => {
                        fetchDashboardData();
                      }}
                    />
                  )}

                  {selectedReceipt && (
                    <ReceiptModal
                      isOpen={!!selectedReceipt}
                      onClose={() => setSelectedReceipt(null)}
                      receiptData={selectedReceipt}
                    />
                  )}
                </motion.div>
              )}


              {activeTab === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Security settings</h2>
                  <div className="bg-white dark:bg-[#1E293B] p-6 rounded-[20px] border border-slate-100 dark:border-slate-800 shadow-soft space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Account password
                        </span>
                        <input
                          type="password"
                          value="**************"
                          disabled
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-500 dark:text-slate-400 outline-none"
                        />
                      </div>
                      <div className="flex items-end pb-1.5">
                        <button
                          onClick={() => router.push('/profile')}
                          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl text-xs font-bold"
                        >
                          Edit profile & password
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Bottom nav — mobile / tablet only                                   */}
      {/* ------------------------------------------------------------------ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white dark:bg-[#1E293B] border-t border-slate-100 dark:border-slate-800 flex items-center justify-around py-2 px-2">
        {railTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              aria-label={tab.label}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl transition-colors ${isSelected ? 'text-[#4F46E5]' : 'text-slate-400'
                }`}
            >
              {tab.icon}
              <span className="text-[9px] font-bold">{tab.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}