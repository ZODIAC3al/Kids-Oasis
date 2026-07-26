'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import axios from 'axios';
import { User, Shield, Compass, ChevronRight, ChevronLeft, Plus, Trash2, Heart, Award } from 'lucide-react';
import NavBar from '@/components/NavBar';
import LottieAnimation from '@/components/LottieAnimation';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    transition: { duration: 0.4, ease: "easeIn" }
  })
};

interface ChildForm {
  name: string;
  birthday: string;
  gender: string;
  allergies: string;
  medicalNotes: string;
}

export default function OnboardingWizard() {
  const router = useRouter();
  const locale = useLocale();
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);

  // Forms states
  const [parentInfo, setParentInfo] = useState({
    phone: '',
    address: '',
    emergencyContact: ''
  });

  const [children, setChildren] = useState<ChildForm[]>([
    { name: '', birthday: '', gender: 'male', allergies: '', medicalNotes: '' }
  ]);

  const [preferences, setPreferences] = useState({
    maxDistance: 10,
    maxBudget: 2000,
    transportNeeded: false,
    curriculum: 'Montessori',
    activities: [] as string[]
  });

  const [submitting, setSubmitting] = useState(false);

  const handleNext = async () => {
    if (step < 3) {
      setDirection(1);
      setStep(step + 1);
    } else {
      setSubmitting(true);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
      const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      try {
        // Post each configured child profile to backend
        for (const child of children) {
          if (child.name.trim()) {
            await axios.post(`${apiUrl}/children`, child, { headers });
          }
        }
      } catch (err) {
        console.error('Failed to submit onboarding children profiles:', err);
      } finally {
        setSubmitting(false);
        router.push(`/${locale}/dashboard/parent`);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const addChild = () => {
    setChildren([...children, { name: '', birthday: '', gender: 'male', allergies: '', medicalNotes: '' }]);
  };

  const removeChild = (index: number) => {
    const values = [...children];
    values.splice(index, 1);
    setChildren(values);
  };

  const updateChild = (index: number, key: keyof ChildForm, value: string) => {
    const values = [...children];
    values[index][key] = value;
    setChildren(values);
  };

  const toggleActivity = (activity: string) => {
    const acts = [...preferences.activities];
    const index = acts.indexOf(activity);
    if (index > -1) {
      acts.splice(index, 1);
    } else {
      acts.push(activity);
    }
    setPreferences({ ...preferences, activities: acts });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] dark:bg-[#0F172A] pb-24 transition-colors duration-300">
      <NavBar />

      <div className="container mx-auto px-6 max-w-3xl mt-12">
        {/* Progress Stepper indicator */}
        <div className="flex items-center justify-between mb-8 px-4">
          {[
            { id: 1, label: 'Profile', icon: <User className="w-4 h-4" /> },
            { id: 2, label: 'Children', icon: <Heart className="w-4 h-4" /> },
            { id: 3, label: 'Preferences', icon: <Compass className="w-4 h-4" /> }
          ].map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                step >= item.id
                  ? "bg-[#4F46E5] text-white shadow-soft"
                  : "bg-slate-200 dark:bg-slate-800 text-slate-400"
              }`}>
                {item.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-wider hidden sm:block ${
                step >= item.id ? "text-slate-700 dark:text-slate-200" : "text-slate-400"
              }`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Wizard Main Card */}
        <div className="bg-white dark:bg-[#1E293B] rounded-xl shadow-soft-lg p-8 border border-slate-100 dark:border-slate-800 relative overflow-hidden min-h-[420px]">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6"
            >
              {/* STEP 1: Personal Profile */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Profile Details</h2>
                    <p className="text-sm text-slate-400 mt-1">Please configure your basic coordinates to match regional nursery suggestions.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                      <input
                        type="text"
                        placeholder="+20 100 000 0000"
                        value={parentInfo.phone}
                        onChange={(e) => setParentInfo({ ...parentInfo, phone: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Emergency Contact</label>
                      <input
                        type="text"
                        placeholder="Emergency Contact Name/Phone"
                        value={parentInfo.emergencyContact}
                        onChange={(e) => setParentInfo({ ...parentInfo, emergencyContact: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Home Address</label>
                      <input
                        type="text"
                        placeholder="123 Innovation Way, Smouha, Alexandria"
                        value={parentInfo.address}
                        onChange={(e) => setParentInfo({ ...parentInfo, address: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Child Metadata */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <LottieAnimation animationPath="/regester-child.json" className="w-16 h-16 shrink-0" />
                      <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Add Children</h2>
                        <p className="text-sm text-slate-400 mt-1">Specify medical constraints, allergies, and ages for children profiles.</p>
                      </div>
                    </div>
                    <button
                      onClick={addChild}
                      className="flex items-center gap-1 px-3.5 py-2 bg-[#4F46E5] text-white text-xs font-bold rounded-xl shadow-soft"
                    >
                      <Plus className="w-4 h-4" /> Add Child
                    </button>
                  </div>

                  <div className="space-y-6 max-h-[350px] overflow-y-auto pr-2">
                    {children.map((child, index) => (
                      <div key={index} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4 relative">
                        {children.length > 1 && (
                          <button
                            onClick={() => removeChild(index)}
                            className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                            aria-label="Remove child"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                            <input
                              type="text"
                              placeholder="Child Name"
                              value={child.name}
                              onChange={(e) => updateChild(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Birthdate</label>
                            <input
                              type="date"
                              value={child.birthday}
                              onChange={(e) => updateChild(index, 'birthday', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gender</label>
                            <select
                              value={child.gender}
                              onChange={(e) => updateChild(index, 'gender', e.target.value)}
                              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none"
                            >
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>

                          <div className="space-y-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Allergies</label>
                              <input
                                type="text"
                                placeholder="Peanuts, milk... (leave blank if none)"
                                value={child.allergies}
                                onChange={(e) => updateChild(index, 'allergies', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Medical Notes</label>
                              <input
                                type="text"
                                placeholder="Blood type, chronic details..."
                                value={child.medicalNotes}
                                onChange={(e) => updateChild(index, 'medicalNotes', e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent text-xs text-slate-700 dark:text-white outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 3: Parent Preferences */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Interests & Setup</h2>
                    <p className="text-sm text-slate-400 mt-1">Specify search preferences to curate personalized AI recommendation feeds.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Distance preferences */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preferred Distance: {preferences.maxDistance} km</label>
                      <input
                        type="range"
                        min="2"
                        max="30"
                        step="1"
                        value={preferences.maxDistance}
                        onChange={(e) => setPreferences({ ...preferences, maxDistance: parseInt(e.target.value) })}
                        className="w-full accent-[#4F46E5]"
                      />
                    </div>

                    {/* Monthly budget */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Max Monthly Budget: {preferences.maxBudget} EGP</label>
                      <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={preferences.maxBudget}
                        onChange={(e) => setPreferences({ ...preferences, maxBudget: parseInt(e.target.value) })}
                        className="w-full accent-[#4F46E5]"
                      />
                    </div>

                    {/* Preferred curriculum */}
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Curriculum Profile</label>
                      <select
                        value={preferences.curriculum}
                        onChange={(e) => setPreferences({ ...preferences, curriculum: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent text-sm text-slate-700 dark:text-white outline-none focus:border-[#4F46E5]"
                      >
                        <option value="Montessori">Montessori</option>
                        <option value="British">British Curriculum</option>
                        <option value="American">American Curriculum</option>
                        <option value="National">National / Arabic</option>
                      </select>
                    </div>

                    {/* Transport needed */}
                    <div className="flex items-center gap-3 pt-6 pl-4">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.transportNeeded}
                          onChange={(e) => setPreferences({ ...preferences, transportNeeded: e.target.checked })}
                          className="w-5 h-5 rounded text-[#4F46E5] focus:ring-[#4F46E5]/30 border-slate-300"
                        />
                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Bus transportation needed
                        </span>
                      </label>
                    </div>

                    {/* Interest Tag chips */}
                    <div className="md:col-span-2 space-y-3">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Interested Activities</label>
                      <div className="flex flex-wrap gap-2">
                        {['Coding', 'Swimming', 'STEM', 'Robotics', 'Music', 'French', 'Gymnastics', 'Drawing'].map((activity) => {
                          const isSelected = preferences.activities.includes(activity);
                          return (
                            <button
                              key={activity}
                              onClick={() => toggleActivity(activity)}
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                                isSelected
                                  ? "bg-[#4F46E5] text-white border-[#4F46E5]"
                                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                              }`}
                            >
                              {activity}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Wizard Navigation Controls */}
          <div className="flex justify-between items-center mt-12 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`flex items-center gap-1.5 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 transition-colors ${
                step === 1 ? "opacity-30 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#0EA5E9] text-white rounded-xl shadow-soft text-sm font-bold hover:brightness-105 transition-all"
            >
              {step === 3 ? 'Complete Setup' : 'Continue'} <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
