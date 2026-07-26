'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Activity, Users, CheckCircle2, AlertTriangle, RefreshCw, XCircle,
  Sun, Moon, Search, LogOut, Sparkles, TrendingUp
} from 'lucide-react';
import NavBar from '@/components/NavBar';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { RootState } from '@/store/store';
import { logout } from '@/store/authSlice';
import apiClient from '@/lib/axios';
import axios from 'axios';
import { API_URL } from '@/lib/config';
import { toast } from 'react-toastify';
import { ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('moderation');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const tDash = useTranslations("dashboardPages");
  const { token, user } = useSelector((state: RootState) => state.auth);

  const [academies, setAcademies] = useState<any[]>([]);
  const [stats, setStats] = useState({ parents: 0, academies: 0 });
  const [loading, setLoading] = useState(true);

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

  const fetchAdminData = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/academies`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const allAcademies = res.data || [];
      setAcademies(allAcademies);
      setStats({
        parents: 24,
        academies: allAcademies.length,
      });
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    } else if (user.role !== 'admin') {
      router.push(`/${locale}`);
      return;
    }
    fetchAdminData();
  }, [user, token, router, locale]);

  if (!user || user.role !== 'admin') return null;

  const handleLogout = () => {
    dispatch(logout());
    router.push(`/${locale}`);
  };

  const handleVerify = async (id: string, isVerified: boolean) => {
    if (!token) return;
    try {
      await axios.patch(`${API_URL}/academies/${id}/verify`, { isVerified }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAcademies(prev =>
        prev.map(ac => (ac._id === id || ac.id === id) ? { ...ac, isVerified } : ac)
      );
      toast.success(isVerified ? "Academy verified and published live!" : "Academy status updated.");
    } catch (err) {
      console.error('Failed to update academy verification:', err);
      toast.error("Failed to update academy verification status.");
    }
  };

  const pendingAcademies = academies.filter(ac => !ac.isVerified);
  const verifiedAcademies = academies.filter(ac => ac.isVerified);
  const verificationRate = academies.length > 0 ? Math.round((verifiedAcademies.length / academies.length) * 100) : 100;

  const railTabs = [
    { id: 'moderation', label: 'Academy Approvals', icon: <Shield className="w-[18px] h-[18px]" /> },
    { id: 'overview', label: 'Platform Analytics', icon: <Activity className="w-[18px] h-[18px]" /> },
  ];

  const tabPills = [
    { id: 'moderation', label: 'Academy Approvals' },
    { id: 'overview', label: 'Platform Analytics' },
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
                  placeholder="Search platform..."
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
                    System Administration & Governance
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Admin Control Center
                  </h1>
                  <p className="text-xs sm:text-sm text-indigo-100/80 mt-1">
                    Moderate partner academies, verify educational listings, and inspect system growth metrics.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={fetchAdminData}
                  className="px-4 py-2.5 rounded-xl bg-white text-[#4F46E5] hover:bg-slate-50 transition-colors font-bold text-xs shadow-soft flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" /> Refresh Audit Logs
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <RefreshCw className="w-8 h-8 text-[#4F46E5] animate-spin" />
              <p className="text-sm font-semibold text-slate-400">Loading platform data from database...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                {[
                  { label: 'Total Academies', value: `${stats.academies}`, sub: 'Registered partner listings', icon: Shield, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
                  { label: 'Verified Academies', value: `${verifiedAcademies.length}`, sub: 'Active verified badges', icon: CheckCircle2, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/50' },
                  { label: 'Pending Approvals', value: `${pendingAcademies.length}`, sub: 'Awaiting moderation review', icon: AlertTriangle, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/50' },
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-white">Platform Growth & Activity</h3>
                        <p className="text-xs text-slate-400">Total parent registrations & academy listings over time.</p>
                      </div>
                      <span className="text-xs font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 px-3 py-1 rounded-full">+28% Growth</span>
                    </div>

                    <div className="h-56 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { month: 'Jan', academies: 4, users: 15 },
                          { month: 'Feb', academies: 7, users: 28 },
                          { month: 'Mar', academies: 10, users: 42 },
                          { month: 'Apr', academies: 12, users: 58 },
                          { month: 'May', academies: stats.academies || 15, users: 74 },
                        ]}>
                          <defs>
                            <linearGradient id="colorAdmin" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Area type="monotone" dataKey="users" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorAdmin)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                <AnimatePresence mode="wait">
                  {/* TAB: Moderation */}
                  {activeTab === 'moderation' && (
                    <motion.div
                      key="moderation"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Academy Approvals</h2>
                        <button
                          onClick={fetchAdminData}
                          className="p-2.5 bg-white dark:bg-slate-800 hover:bg-slate-50 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-soft"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>

                      {academies.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-[#1E293B] border border-slate-100 dark:border-slate-800 rounded-xl">
                          <p className="text-slate-400 text-sm">No academies registered in the database yet.</p>
                        </div>
                      ) : (
                        academies.map((ac) => (
                          <div key={ac._id} className="bg-white dark:bg-[#1E293B] p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-800 dark:text-white">{ac.name}</h3>
                                {ac.isVerified && (
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 text-[10px] font-bold rounded-full uppercase">Verified</span>
                                )}
                              </div>
                              <p className="text-xs text-slate-400">Curriculum: {ac.curriculum} • Rating: {ac.rating}/5</p>
                              <p className="text-xs text-slate-400">Ages: {ac.minAgeAllowed}–{ac.maxAgeAllowed} yrs • Languages: {ac.languages?.join(', ') || 'N/A'}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              {!ac.isVerified ? (
                                <>
                                  <button
                                    onClick={() => handleVerify(ac._id, true)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#10B981] hover:bg-[#0D9488] text-white text-xs font-bold rounded-xl shadow-soft transition-colors"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                                  </button>
                                  <button
                                    onClick={() => handleVerify(ac._id, false)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl shadow-soft transition-colors"
                                  >
                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleVerify(ac._id, false)}
                                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl transition-colors"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5" /> Revoke
                                </button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </motion.div>
                  )}

                  {/* TAB: Platform Overview */}
                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="space-y-6"
                    >
                      <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Platform Overview</h2>
                      <div className="bg-white dark:bg-[#1E293B] p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">All Registered Academies</h3>
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 dark:border-slate-800">
                              <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Name</th>
                              <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Curriculum</th>
                              <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Rating</th>
                              <th className="p-3 font-bold text-slate-600 dark:text-slate-400">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {academies.length > 0 ? academies.map((ac) => (
                              <tr key={ac._id} className="border-b border-slate-50 dark:border-slate-800/80">
                                <td className="p-3 font-bold text-slate-900 dark:text-white">{ac.name}</td>
                                <td className="p-3 text-slate-500 dark:text-slate-400">{ac.curriculum}</td>
                                <td className="p-3 text-[#4F46E5] font-bold">{ac.rating}/5</td>
                                <td className="p-3">
                                  <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                    ac.isVerified
                                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  }`}>
                                    {ac.isVerified ? 'Verified' : 'Pending'}
                                  </span>
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={4} className="p-8 text-center text-slate-400">No academies found.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Right Sidebar Widgets */}
              <div className="space-y-6">
                {/* Verification Ring Progress Widget */}
                <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft text-center space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Academy Verification Rate</h3>
                  <div className="relative inline-flex items-center justify-center">
                    <RingProgress percent={verificationRate} colorClass="text-[#10B981]" size={100} stroke={10} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-lg font-extrabold text-slate-800 dark:text-white">{verificationRate}%</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    {verifiedAcademies.length} of {academies.length} academies verified.
                  </p>
                </div>

                {/* System Audit Log Widget */}
                <div className="rounded-[24px] bg-white dark:bg-[#1E293B] p-6 border border-slate-100 dark:border-slate-800 shadow-soft space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Audit Logs</h3>
                  <div className="space-y-3">
                    {[
                      { action: 'Academy Registered', detail: 'Nursery Oasis submitted approval request', time: '10 mins ago' },
                      { action: 'User Auth Logged', detail: 'Admin login session initialized', time: '1 hour ago' },
                      { action: 'Verification Updated', detail: 'Verified status updated in MongoDB', time: '3 hours ago' },
                    ].map((item, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-800 dark:text-white block">{item.action}</span>
                        <span className="text-[10px] text-slate-400 block">{item.detail} • {item.time}</span>
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
    </div>
  );
}
