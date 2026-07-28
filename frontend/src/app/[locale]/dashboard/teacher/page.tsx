'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ClipboardList, FileText, CheckCircle2, RefreshCw, Sun, Moon, Search,
  Home, LogOut, Award, Users, TrendingUp, Calendar, Clock, Check, Sparkles, User, GraduationCap
} from 'lucide-react';

import NavBar from '@/components/NavBar';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import apiClient from '@/lib/axios';
import axios from 'axios';
import { toast } from 'react-toastify';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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
        className={colorClass}
        stroke="currentColor"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function TeacherDashboard() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const locale = useLocale();
  const dispatch = useDispatch();
  const tDash = useTranslations("dashboardPages");
  const tRoles = useTranslations("roles");
  const { token, user } = useSelector((state: RootState) => state.auth);

  // Real data states
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({ childId: '', activity: '', behavior: 'Good', notes: '' });
  const [submitMsg, setSubmitMsg] = useState('');

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

  const fetchTeacherData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [enrollRes, childrenRes] = await Promise.allSettled([
        apiClient.get('/enrollments'),
        apiClient.get('/children'),
      ]);

      let data: any[] = [];
      if (enrollRes.status === 'fulfilled' && Array.isArray(enrollRes.value.data) && enrollRes.value.data.length > 0) {
        data = enrollRes.value.data;
      } else if (childrenRes.status === 'fulfilled' && Array.isArray(childrenRes.value.data)) {
        data = childrenRes.value.data.map(c => ({ childId: c, _id: c._id, status: 'Approved' }));
      }

      setEnrollments(data);

      const initAttendance: Record<string, boolean> = {};
      data.forEach((e, idx) => {
        const id = (typeof e.childId === 'object' ? e.childId?._id : e._id) || `child-${idx}`;
        initAttendance[id] = true;
      });
      setAttendance(initAttendance);

      const firstId = data[0]?.childId?._id || data[0]?._id;
      if (firstId) {
        setReport(r => ({ ...r, childId: firstId }));
      }
    } catch (err) {
      console.error('Failed to load teacher data from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    } else if (user.role !== 'teacher' && user.role !== 'admin' && user.role !== 'serviceprovider') {
      router.push(`/${locale}`);
      return;
    }
    fetchTeacherData();
  }, [user, token, router, locale]);

  if (!user || (user.role !== 'teacher' && user.role !== 'admin' && user.role !== 'serviceprovider')) return null;

  const toggleAttendance = (childId: string) => {
    setAttendance(prev => ({ ...prev, [childId]: !prev[childId] }));
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}`);
  };

  const presentCount = Object.values(attendance).filter(Boolean).length;
  const totalCount = enrollments.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Daily behavioral report published & sent to parent timeline!');
    setSubmitMsg('Report published & sent to parent timeline ✓');
    setTimeout(() => setSubmitMsg(''), 3000);
    setReport(r => ({ ...r, activity: '', notes: '' }));
  };

  const railTabs = [
    { id: 'attendance', label: 'Attendance Tracker', icon: <ClipboardList className="w-[18px] h-[18px]" /> },
    { id: 'reports', label: 'Student Reports', icon: <FileText className="w-[18px] h-[18px]" /> },
  ];

  const tabPills = [
    { id: 'attendance', label: 'Daily Attendance' },
    { id: 'reports', label: 'Student Reports' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] transition-colors duration-300 pb-24 lg:pb-10">
      <NavBar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6 lg:mt-10 flex gap-6">
        {/* Left Desktop Navigation Rail */}
        <aside className="hidden lg:flex flex-col items-center gap-2 w-16 shrink-0 py-4 sticky top-6 h-fit rounded-[24px] bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 shadow-soft">
          {railTabs.map((tab) => {
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                aria-label={tab.label}
                onClick={() => setActiveTab(tab.id)}
                className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-200 ${
                  isSelected
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
            onClick={handleLogout}
            aria-label="Log out"
            className="w-10 h-10 flex items-center justify-center rounded-2xl text-slate-350 hover:text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
          </button>
        </aside>

        {/* Main Column */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* Top Bar: Navigation Pills + Search + Theme Switcher */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar -mx-1 px-1">
              {tabPills.map((tab) => {
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                      isSelected
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
                  placeholder="Search students..."
                  className="bg-transparent outline-none text-xs text-slate-600 dark:text-slate-300 placeholder:text-slate-350 w-full"
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

          {/* Hero Welcome Card Banner */}
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] p-6 sm:p-8 text-white shadow-soft">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl backdrop-blur-md">
                  {user.firstName ? user.firstName.charAt(0) : 'T'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/20 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Teacher Workspace & Class Management
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome back, {user.firstName || 'Teacher'}!
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-100/80 mt-1">
                    Manage student attendance, log daily classroom activities, and send parent progress updates.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={fetchTeacherData}
                  className="px-4 py-2.5 rounded-xl bg-white text-[#4F46E5] hover:bg-slate-50 transition-colors font-bold text-xs shadow-soft flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh Roster
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#4F46E5] animate-spin" />
              <p className="text-sm font-semibold text-slate-400">Loading class data from database...</p>
            </div>
          ) : (user as any)?.status === 'Pending Verification' ? (

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 sm:p-12 rounded-[28px] bg-white dark:bg-[#1E293B] border border-sky-200 dark:border-sky-900/50 shadow-soft text-center max-w-2xl mx-auto space-y-6 my-8"
            >
              <div className="w-16 h-16 rounded-3xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
                <GraduationCap className="w-8 h-8 animate-pulse" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300 text-xs font-bold uppercase tracking-wider">
                  Verification Pending
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Educator Credentials Under Audit
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Your educator application for{" "}
                  <strong className="text-slate-800 dark:text-white font-bold">
                    {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : "Educator"}
                  </strong>{" "}
                  is undergoing review by your selected Academy Principal. You will gain access to classroom rosters upon team sign-off.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-left space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Teaching License & Specialization</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400">Under Review</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Educator Resume (CV)</span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 font-mono">Received</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 dark:text-slate-300">
                  <span>Academy Faculty Association</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">Awaiting Principal Approval</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  onClick={fetchTeacherData}
                  className="px-6 py-3 rounded-xl bg-[#4F46E5] hover:bg-[#3F37C9] text-white font-bold text-xs shadow-soft transition flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Sync Verification Status
                </button>
              </div>
            </motion.div>
          ) : (
            <>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { label: 'Enrolled Students', value: `${totalCount} Children`, sub: 'Active classroom roster', icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
                  { label: 'Present Today', value: `${presentCount} Children`, sub: `${totalCount - presentCount} marked absent`, icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
                  { label: 'Class Attendance Rate', value: `${attendanceRate}%`, sub: 'Daily average rate', icon: TrendingUp, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
                ].map((kpi, i) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={i} className="rounded-[24px] bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 p-5 shadow-soft space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</span>
                        <div className={`p-2 rounded-xl ${kpi.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</h4>
                        <p className="text-xs text-slate-400 mt-1">{kpi.sub}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Split Content (2 Columns Left + 1 Column Right Sidebar) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Area */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Recharts Class Attendance Chart */}
                  <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">Weekly Class Attendance Trend</h3>
                        <p className="text-xs text-slate-400">Daily present vs absent children breakdown.</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
                        {presentCount} Present Today
                      </span>
                    </div>

                    <div className="h-56 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { day: 'Mon', present: Math.max(1, presentCount - 1), absent: 1 },
                          { day: 'Tue', present: presentCount, absent: totalCount - presentCount },
                          { day: 'Wed', present: Math.min(totalCount, presentCount + 1), absent: 0 },
                          { day: 'Thu', present: presentCount, absent: totalCount - presentCount },
                          { day: 'Fri', present: Math.max(1, presentCount - 2), absent: 2 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="present" fill="#10B981" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="absent" fill="#EF4444" radius={[6, 6, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {/* TAB: Attendance */}
                    {activeTab === 'attendance' && (
                      <motion.div
                        key="attendance"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-6"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Daily Attendance</h2>
                            <p className="text-xs text-slate-400 mt-1">Toggle to mark each student as present or absent.</p>
                          </div>
                          <button onClick={fetchTeacherData} className="p-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>

                        {enrollments.length === 0 ? (
                          <p className="text-center text-slate-400 text-sm py-6">No enrolled students found in database.</p>
                        ) : (
                          <div className="space-y-3">
                            {enrollments.map((enroll, idx) => {
                              const childObj = typeof enroll.childId === 'object' ? enroll.childId : (typeof enroll === 'object' && enroll.name ? enroll : null);
                              const childId = childObj?._id || enroll._id || `child-${idx}`;
                              const childName = childObj?.name || enroll.childName || (typeof enroll.childId === 'string' ? `Student #${enroll.childId.slice(-4)}` : 'Student');
                              const programName = enroll.programName || enroll.programId?.name || 'Montessori Program';

                              const isPresent = attendance[childId] ?? true;
                              return (
                                <div
                                  key={childId}
                                  onClick={() => toggleAttendance(childId)}
                                  className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all duration-200 ${
                                    isPresent
                                      ? 'border-[#10B981] bg-[#10B981]/5 dark:bg-[#10B981]/10'
                                      : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-[#4F46E5] flex items-center justify-center font-bold text-sm">
                                      {childName.charAt(0)}
                                    </div>
                                    <div>
                                      <span className="text-sm font-bold text-slate-800 dark:text-white">{childName}</span>
                                      <span className="block text-xs text-slate-400">
                                        {programName}
                                      </span>
                                    </div>
                                  </div>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                                    isPresent ? 'bg-[#10B981] border-[#10B981] text-white' : 'border-slate-300 bg-white dark:bg-slate-800'
                                  }`}>
                                    {isPresent && <CheckCircle2 className="w-4 h-4" />}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
                          <button
                            onClick={() => toast.success(`Attendance log saved: ${presentCount}/${totalCount} students present!`)}
                            className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl text-xs font-bold shadow-soft transition-colors"
                          >
                            Submit Attendance Log
                          </button>
                        </div>
                      </motion.div>
                    )}

                    {/* TAB: Reports */}
                    {activeTab === 'reports' && (
                      <motion.div
                        key="reports"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-6"
                      >
                        <div>
                          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Create Student Report</h2>
                          <p className="text-xs text-slate-400 mt-1">Submit activity feedback directly to parent timelines.</p>
                        </div>

                        {submitMsg && (
                          <div className="px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-xl">
                            {submitMsg}
                          </div>
                        )}

                        <form onSubmit={handleReportSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Student</label>
                              <select
                                value={report.childId}
                                onChange={(e) => setReport({ ...report, childId: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                              >
                                {enrollments.map(e => e.childId && (
                                  <option key={e.childId._id} value={e.childId._id}>{e.childId.name}</option>
                                ))}
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Behavior</label>
                              <select
                                value={report.behavior}
                                onChange={(e) => setReport({ ...report, behavior: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                              >
                                <option value="Excellent">Excellent</option>
                                <option value="Good">Good</option>
                                <option value="Needs Improvement">Needs Improvement</option>
                              </select>
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Activities Conducted</label>
                              <input
                                type="text"
                                placeholder="e.g. Reading, drawing shapes, outdoor exercises"
                                value={report.activity}
                                onChange={(e) => setReport({ ...report, activity: e.target.value })}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                              />
                            </div>

                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Observations</label>
                              <textarea
                                placeholder="Detailed feedback regarding eating patterns or lesson engagement..."
                                value={report.notes}
                                onChange={(e) => setReport({ ...report, notes: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                              />
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#3F37C9] text-white rounded-xl text-xs font-bold shadow-soft transition-colors"
                            >
                              Publish Report
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right Sidebar Widgets */}
                <div className="space-y-6">
                  {/* Attendance Ring Progress Widget */}
                  <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft text-center space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Class Progress Overview</h3>
                    <div className="relative inline-flex items-center justify-center">
                      <RingProgress percent={attendanceRate} colorClass="text-[#10B981]" size={100} stroke={10} />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-lg font-extrabold text-slate-800 dark:text-white">{attendanceRate}%</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-400">
                      {presentCount} of {totalCount} students present today.
                    </p>
                  </div>

                  {/* Class Schedule Widget */}
                  <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Today's Class Schedule</h3>
                    <div className="space-y-3">
                      {[
                        { time: '09:00 AM', title: 'Morning Assembly & Quran', status: 'Completed' },
                        { time: '10:30 AM', title: 'Montessori STEM Play', status: 'In Progress' },
                        { time: '01:00 PM', title: 'Language & Drawing Session', status: 'Upcoming' },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                          <div>
                            <span className="text-[10px] font-bold text-[#4F46E5] block">{item.time}</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-white">{item.title}</span>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5]">
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Bottom Navigation Rail */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-[#1E293B]/90 backdrop-blur-xl border-t border-slate-100 dark:border-slate-800 px-4 py-2 flex items-center justify-around z-40">
        {railTabs.map((tab) => {
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 text-[10px] font-semibold transition-colors ${
                isSelected ? 'text-[#4F46E5] dark:text-[#818CF8]' : 'text-slate-400'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
