"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Plus, Sparkles, Check, ArrowRight, User } from "lucide-react";
import apiClient from "@/lib/axios";
import { toast } from "react-toastify";

interface Child {
  _id: string;
  name: string;
  birthday?: string;
  gender?: string;
  avatar?: string;
}

interface ApplyChildModalProps {
  isOpen: boolean;
  onClose: () => void;
  academyName: string;
  academyId: string;
  programName?: string;
  fee?: number;
  onSuccess?: () => void;
}

export default function ApplyChildModal({
  isOpen,
  onClose,
  academyName,
  academyId,
  programName = "Standard Preschool Track",
  fee = 1800,
  onSuccess,
}: ApplyChildModalProps) {
  const [children, setChildren] = useState<Child[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  // Quick Add Child Form State (if no children exist)
  const [showAddForm, setShowAddForm] = useState(false);
  const [childName, setChildName] = useState("");
  const [childBirthday, setChildBirthday] = useState("2022-05-15");
  const [childGender, setChildGender] = useState<"male" | "female">("male");
  const [addingChild, setAddingChild] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchChildren();
    }
  }, [isOpen]);

  const fetchChildren = async () => {
    setLoadingChildren(true);
    try {
      const res = await apiClient.get("/children");
      const list = res.data || [];
      setChildren(list);
      if (list.length > 0) {
        setSelectedChildId(list[0]._id);
        setShowAddForm(false);
      } else {
        setShowAddForm(true);
      }
    } catch (err) {
      console.warn("Failed to fetch children for selection:", err);
      setShowAddForm(true);
    } finally {
      setLoadingChildren(false);
    }
  };

  const handleAddChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!childName.trim()) {
      toast.error("Please enter your child's name.");
      return;
    }
    setAddingChild(true);
    try {
      const res = await apiClient.post("/children", {
        name: childName.trim(),
        birthday: childBirthday,
        gender: childGender,
      });
      toast.success(`Child profile created for ${childName}!`);
      const newChild = res.data;
      setChildren((prev) => [newChild, ...prev]);
      setSelectedChildId(newChild._id || newChild.id);
      setShowAddForm(false);
      setChildName("");
    } catch (err: any) {
      toast.error("Failed to add child profile.");
    } finally {
      setAddingChild(false);
    }
  };

  const handleSubmitApplication = async () => {
    if (!selectedChildId) {
      toast.error("Please select a child to apply for this academy.");
      return;
    }

    setSubmitting(true);
    try {
      await apiClient.post("/enrollments", {
        academyId,
        childId: selectedChildId,
        programName,
        fee,
        status: "Pending",
      });

      const selectedChild = children.find((c) => c._id === selectedChildId);
      toast.success(
        `Application submitted to ${academyName} for ${selectedChild?.name || "your child"}!`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-200 block mb-0.5">
                Academy Enrollment Application
              </span>
              <h3 className="text-xl font-extrabold">{academyName}</h3>
              <p className="text-xs text-indigo-100/80 mt-0.5">{programName} • EGP {fee.toLocaleString()}/term</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-5">
            {!showAddForm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                    Select Which Child to Apply For:
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(true)}
                    className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Another Child
                  </button>
                </div>

                {loadingChildren ? (
                  <div className="py-8 text-center text-xs text-slate-400">Loading your children profiles...</div>
                ) : (
                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {children.map((child) => {
                      const isSelected = selectedChildId === child._id;
                      return (
                        <div
                          key={child._id}
                          onClick={() => setSelectedChildId(child._id)}
                          className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 dark:border-indigo-500"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-sm">
                              {child.name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                                {child.name}
                              </h4>
                              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                                {child.gender || "Child"} • {child.birthday || "Age 3"}
                              </p>
                            </div>
                          </div>

                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center transition ${
                              isSelected
                                ? "border-indigo-600 bg-indigo-600 text-white"
                                : "border-slate-300 dark:border-slate-700"
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!selectedChildId || submitting}
                    onClick={handleSubmitApplication}
                    className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      "Submitting Application..."
                    ) : (
                      <>
                        Submit Application to Academy Review <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleAddChild} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    Add Child Profile First
                  </h4>
                  {children.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                    >
                      Back to Selection
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Child's Full Name
                  </label>
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    required
                    placeholder="e.g. Adam Maher"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={childBirthday}
                      onChange={(e) => setChildBirthday(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Gender
                    </label>
                    <select
                      value={childGender}
                      onChange={(e) => setChildGender(e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    >
                      <option value="male">Boy 👦</option>
                      <option value="female">Girl 👧</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addingChild}
                  className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-md transition disabled:opacity-50"
                >
                  {addingChild ? "Creating Child Profile..." : "Save Child & Continue Application"}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
