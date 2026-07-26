'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Award, Settings, TrendingUp, Users, FileCheck, Calendar,
  Star, Edit3, Plus, Check, X, ShieldAlert, RefreshCw, Sun, Moon, Search, LogOut, Sparkles
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import apiClient from '@/lib/axios';
import { toast } from 'react-toastify';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

export default function AcademyDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const tDash = useTranslations("dashboardPages");
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [academies, setAcademies] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editAcademy, setEditAcademy] = useState<any | null>(null);
  const [savingAcademy, setSavingAcademy] = useState(false);

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

  const fetchAcademyData = async () => {
    setLoading(true);
    try {
      const [enrollRes, acadRes, bookRes] = await Promise.allSettled([
        apiClient.get('/enrollments'),
        apiClient.get('/academies/owner/me'),
        apiClient.get('/bookings'),
      ]);

      if (enrollRes.status === 'fulfilled' && Array.isArray(enrollRes.value.data)) {
        setEnrollments(enrollRes.value.data);
      }
      if (acadRes.status === 'fulfilled' && Array.isArray(acadRes.value.data)) {
        setAcademies(acadRes.value.data);
        if (acadRes.value.data.length > 0) {
          setEditAcademy(acadRes.value.data[0]);
        }
      }
      if (bookRes.status === 'fulfilled' && Array.isArray(bookRes.value.data)) {
        setBookings(bookRes.value.data);
      }
    } catch (err) {
      console.error("Failed to query academy data from DB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    } else if (user.role !== 'nurseryOwner' && user.role !== 'academyOwner' && user.role !== 'admin' && user.role !== 'serviceprovider') {
      router.push(`/${locale}`);
      return;
    }

    fetchAcademyData();
  }, [user, token, router, locale]);

  if (!user || (user.role !== 'nurseryOwner' && user.role !== 'academyOwner' && user.role !== 'admin' && user.role !== 'serviceprovider')) {
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}`);
  };

  const handleApplicationStatus = async (id: string, newStatus: string) => {
    try {
      await apiClient.patch(`/enrollments/${id}/status`, { status: newStatus });
      setEnrollments(prev => prev.map(item => item._id === id ? { ...item, status: newStatus } : item));
      toast.success(`Application marked as ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update status.");
    }
  };

  const handleSaveAcademy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAcademy?._id && !editAcademy?.id) return;
    const targetId = editAcademy._id || editAcademy.id;
    setSavingAcademy(true);
    try {
      const res = await apiClient.patch(`/academies/${targetId}`, editAcademy);
      toast.success("Academy details updated!");
      setAcademies(prev => prev.map(a => (a._id === targetId || a.id === targetId) ? res.data : a));
    } catch (err) {
      toast.error("Failed to save academy details.");
    } finally {
      setSavingAcademy(false);
    }
  };

  const activeStudents = enrollments.filter(e => e.status === 'Approved' || e.status === 'Enrolled' || e.status === 'Accepted');
  const pendingRequests = enrollments.filter(e => e.status === 'Pending' || e.status === 'Under Review');
  const monthlyRevenue = activeStudents.reduce((sum, e) => sum + (e.fee || e.programId?.price || e.price || 1800), 0);
  const activeStudentsCount = activeStudents.length;

  const railTabs = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
    { id: 'students', label: 'Students Directory', icon: <Users className="w-[18px] h-[18px]" /> },
    { id: 'applications', label: 'Enrollment Requests', icon: <FileCheck className="w-[18px] h-[18px]" /> },
    { id: 'visits', label: 'Campus Visits', icon: <Calendar className="w-[18px] h-[18px]" /> },
    { id: 'settings', label: 'Academy Settings', icon: <Settings className="w-[18px] h-[18px]" /> },
  ];

  const tabPills = [
    { id: 'dashboard', label: 'Overview' },
    { id: 'students', label: 'Students' },
    { id: 'applications', label: 'Enrollments' },
    { id: 'visits', label: 'Campus Visits' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] transition-colors duration-300 pb-24 lg:pb-10">
      <NavBar />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 mt-6 lg:mt-10 flex gap-6">
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

        <div className="flex-1 min-w-0 space-y-6">
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
                  placeholder="Search directory..."
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

          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#4F46E5] via-[#4338CA] to-[#3730A3] p-6 sm:p-8 text-white shadow-soft">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-bold text-xl backdrop-blur-md">
                  {user.firstName ? user.firstName.charAt(0) : 'A'}
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white/90 backdrop-blur-md border border-white/20 mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Academy Management & Operations
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    {user.firstName ? `${user.firstName}'s Academy Dashboard` : 'Academy Management'}
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-100/80 mt-1">
                    Manage enrollment applications, campus visit bookings, and academy configuration.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={fetchAcademyData}
                  className="px-4 py-2.5 rounded-xl bg-white text-[#4F46E5] hover:bg-slate-50 transition-colors font-bold text-xs shadow-soft flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Sync Database
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#4F46E5] animate-spin" />
              <p className="text-sm font-semibold text-slate-450">Synchronizing database records...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { label: 'Monthly Revenue', value: `EGP ${monthlyRevenue || (academies.length * 15000)}`, sub: '+12.5% vs last month', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
                  { label: 'Active Students', value: `${activeStudentsCount} Enrolled`, sub: `${pendingRequests.length} pending review`, icon: Users, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
                  { label: 'Managed Branches', value: `${academies.length} Academies`, sub: 'Active partner listings', icon: Award, color: 'text-sky-500 bg-sky-50 dark:bg-sky-950/50' },
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

              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div
                    key="dashboard"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    <div className="lg:col-span-2 space-y-6">
                      <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">Revenue & Enrollment Analytics</h3>
                            <p className="text-xs text-slate-400">Monthly student registration and payment volume.</p>
                          </div>
                          <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">+14.2% Growth</span>
                        </div>

                        <div className="h-64 w-full pt-2">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={[
                              { month: 'Jan', revenue: 12000, students: 8 },
                              { month: 'Feb', revenue: 15000, students: 11 },
                              { month: 'Mar', revenue: 18000, students: 14 },
                              { month: 'Apr', revenue: 22000, students: 18 },
                              { month: 'May', revenue: 26000, students: 22 },
                              { month: 'Jun', revenue: monthlyRevenue || 31000, students: activeStudentsCount || 25 },
                            ]}>
                              <defs>
                                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                              <YAxis tick={{ fontSize: 11 }} />
                              <Tooltip />
                              <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        </div>
                      </div>

                      {/* Recent Enrollment Requests */}
                      <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">Recent Enrollment Requests</h3>
                          <span className="text-xs font-semibold text-slate-400">{pendingRequests.length} Pending</span>
                        </div>

                        {pendingRequests.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-6">No pending enrollment requests.</p>
                        ) : (
                          <div className="space-y-3">
                            {pendingRequests.slice(0, 4).map((enroll) => (
                              <div key={enroll._id} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                                <div>
                                  <span className="text-sm font-bold text-slate-800 dark:text-white block">{enroll.childId?.name || 'Child Applicant'}</span>
                                  <span className="text-xs text-slate-400">{enroll.programId?.name || 'Standard Program'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button onClick={() => handleApplicationStatus(enroll._id, 'Approved')} className="p-2 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 font-bold text-xs">
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleApplicationStatus(enroll._id, 'Rejected')} className="p-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 font-bold text-xs">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    {/* Right Sidebar Widgets */}
                    <div className="space-y-6">
                      <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft text-center space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Capacity Utilization</h3>
                        <div className="relative inline-flex items-center justify-center">
                          <RingProgress percent={Math.min(100, Math.round((activeStudentsCount / 30) * 100))} colorClass="text-[#4F46E5]" size={100} stroke={10} />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-lg font-extrabold text-slate-800 dark:text-white">
                              {Math.min(100, Math.round((activeStudentsCount / 30) * 100))}%
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-400">
                          {activeStudentsCount} of 30 total student capacity occupied.
                        </p>
                      </div>

                      {/* Campus Visits Widget */}
                      <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Upcoming Campus Tours</h3>
                        {bookings.length === 0 ? (
                          <p className="text-xs text-slate-400 text-center py-4">No scheduled campus visits.</p>
                        ) : (
                          <div className="space-y-3">
                            {bookings.slice(0, 3).map((b) => (
                              <div key={b._id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                                <span className="text-xs font-bold text-slate-800 dark:text-white block">{b.parentName || 'Parent Visitor'}</span>
                                <span className="text-[10px] text-slate-400 block">{b.date ? new Date(b.date).toLocaleDateString() : 'Date TBD'} • {b.status || 'Scheduled'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB: Students Directory */}
                {activeTab === 'students' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Students Directory</h2>
                    </div>

                    <div className="bg-white dark:bg-[#1E293B] rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft overflow-hidden">
                      <table className="w-full text-left border-collapse text-sm">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-850">
                            <th className="p-4 font-bold text-slate-600 dark:text-slate-355">Student Name</th>
                            <th className="p-4 font-bold text-slate-600 dark:text-slate-355">Parent</th>
                            <th className="p-4 font-bold text-slate-600 dark:text-slate-355">Phone</th>
                            <th className="p-4 font-bold text-slate-600 dark:text-slate-355">Program</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enrollments.length > 0 ? (
                            enrollments.map((std, i) => {
                              const parentObj = typeof std.parentId === 'object' ? std.parentId : null;
                              const childObj = typeof std.childId === 'object' ? std.childId : null;
                              const parentFullName = parentObj
                                ? `${parentObj.firstName || ''} ${parentObj.lastName || ''}`.trim()
                                : std.parentName || (typeof std.parentId === 'string' ? `Parent #${std.parentId.slice(-4)}` : 'Parent Guardian');

                              const studentName = childObj?.name
                                || std.childName
                                || (typeof std.childId === 'string' ? `Student #${std.childId.slice(-4)}` : 'Enrolled Student');

                              const phone = parentObj?.phoneNumber || std.parentPhone || '+20 100 000 0000';
                              const program = std.programName || std.programId?.name || 'Early Learning Program';

                              return (
                                <tr key={std._id || i} className="border-b border-slate-50 dark:border-slate-800/80">
                                  <td className="p-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] font-bold text-xs flex items-center justify-center">
                                      {studentName.charAt(0)}
                                    </div>
                                    {studentName}
                                  </td>
                                  <td className="p-4 text-slate-600 dark:text-slate-300 font-semibold">{parentFullName || 'Parent Guardian'}</td>
                                  <td className="p-4 text-slate-500 dark:text-slate-400 font-mono text-xs">{phone}</td>
                                  <td className="p-4">
                                    <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-[#4F46E5] dark:text-[#818CF8] rounded-full text-xs font-bold">
                                      {program}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={4} className="p-8 text-center text-slate-400 font-semibold">No active students registered in database.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}

                {/* TAB: Applications */}
                {activeTab === 'applications' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Enrollment Requests</h2>
                    
                    <div className="space-y-4">
                      {pendingRequests.length > 0 ? (
                        pendingRequests.map((app) => {
                          const childObj = typeof app.childId === 'object' ? app.childId : null;
                          const childName = childObj?.name || app.childName || (typeof app.childId === 'string' ? `Child #${app.childId.slice(-4)}` : 'Child Applicant');
                          const program = app.programName || app.programId?.name || 'Standard Learning Track';

                          return (
                            <div key={app._id} className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-bold text-slate-800 dark:text-white">{childName}</h4>
                                  {childObj?.gender && (
                                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-[10px] font-bold text-slate-500 uppercase">{childObj.gender}</span>
                                  )}
                                </div>
                                <p className="text-xs text-slate-400">Requesting: {program}</p>
                              </div>

                            <div className="flex items-center gap-3">
                              {app.status === 'Pending' || app.status === 'Under Review' ? (
                                <>
                                  <button
                                    onClick={() => handleApplicationStatus(app._id, 'Approved')}
                                    className="flex items-center gap-1 p-2 bg-[#10B981] hover:bg-[#0D9488] text-white text-xs font-bold rounded-xl shadow-soft"
                                  >
                                    <Check className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleApplicationStatus(app._id, 'Rejected')}
                                    className="flex items-center gap-1 p-2 bg-red-500 hover:bg-red-650 text-white text-xs font-bold rounded-xl shadow-soft"
                                  >
                                    <X className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </>
                              ) : (
                                <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                  app.status === 'Approved' ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                                }`}>{app.status}</span>
                              )}
                            </div>
                          </div>
                        );
                      })
                      ) : (
                        <div className="text-center py-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl">
                          <p className="text-xs text-slate-400 font-semibold">No pending enrollment applications found in database.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* TAB: Campus Visits */}
                {activeTab === 'visits' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Campus Visit Bookings</h2>
                    <div className="space-y-4">
                      {bookings.length > 0 ? (
                        bookings.map((bk, i) => (
                          <div key={bk._id || i} className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-white">{bk.type || "Campus Tour Visit"}</h4>
                              <p className="text-xs text-slate-400 mt-1">Date: {bk.date || "Scheduled"} • Time Slot: {bk.timeSlot || bk.time || "10:00 AM"}</p>
                            </div>
                            <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full">
                              {bk.status || "Confirmed"}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl">
                          <p className="text-xs text-slate-400 font-semibold">No campus tour bookings registered in database.</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* TAB: Academy Settings (Live MongoDB Editor) */}
                {activeTab === 'settings' && editAcademy && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-6"
                  >
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Academy Profile & Settings</h2>
                    
                    <form onSubmit={handleSaveAcademy} className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Academy Name</label>
                          <input
                            type="text"
                            value={editAcademy.name || ""}
                            onChange={(e) => setEditAcademy({ ...editAcademy, name: e.target.value })}
                            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Location / Address</label>
                          <input
                            type="text"
                            value={editAcademy.location || editAcademy.address || ""}
                            onChange={(e) => setEditAcademy({ ...editAcademy, location: e.target.value, address: e.target.value })}
                            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Description</label>
                        <textarea
                          rows={3}
                          value={editAcademy.description || ""}
                          onChange={(e) => setEditAcademy({ ...editAcademy, description: e.target.value })}
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent p-3 text-xs font-semibold text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Monthly Price (EGP)</label>
                          <input
                            type="number"
                            value={editAcademy.price || 1800}
                            onChange={(e) => setEditAcademy({ ...editAcademy, price: Number(e.target.value) })}
                            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Min Age Allowed</label>
                          <input
                            type="number"
                            value={editAcademy.minAgeAllowed ?? 2}
                            onChange={(e) => setEditAcademy({ ...editAcademy, minAgeAllowed: Number(e.target.value) })}
                            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Max Age Allowed</label>
                          <input
                            type="number"
                            value={editAcademy.maxAgeAllowed ?? 5}
                            onChange={(e) => setEditAcademy({ ...editAcademy, maxAgeAllowed: Number(e.target.value) })}
                            className="w-full h-10 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent px-3 text-xs font-semibold text-slate-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={savingAcademy}
                        className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold rounded-xl shadow-soft transition"
                      >
                        {savingAcademy ? "Saving to Database..." : "Save Academy Changes"}
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
