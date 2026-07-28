"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  GraduationCap,
  Upload,
  CheckCircle2,
  ShieldCheck,
  FileText,
  Lock,
  ChevronRight,
  ArrowLeft,
  Heart,
  Plus,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/config";
import GoogleAuthModal from "@/components/GoogleAuthModal";
import TermsModal from "@/components/TermsModal";
import SignupFaqSection from "@/components/SignupFaqSection";
import { motion, AnimatePresence } from "framer-motion";

export default function Signup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedRole, setSelectedRole] = useState<"parent" | "nurseryOwner" | "teacher">("parent");

  // Step 1: Base Credentials
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // Step 2: Role-Specific Data & Documents
  // Parent Data
  const [parentIdDoc, setParentIdDoc] = useState<File | null>(null);
  const [parentPhoto, setParentPhoto] = useState<File | null>(null);
  const [childName, setChildName] = useState("");
  const [childBirthday, setChildBirthday] = useState("2022-04-10");
  const [childGender, setChildGender] = useState<"male" | "female">("male");
  const [childMedical, setChildMedical] = useState("");

  // Academy Owner Data
  const [academyName, setAcademyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [commercialLicenseDoc, setCommercialLicenseDoc] = useState<File | null>(null);
  const [ownerIdDoc, setOwnerIdDoc] = useState<File | null>(null);
  const [propertyLeaseDoc, setPropertyLeaseDoc] = useState<File | null>(null);

  // Educator / Teacher Data
  const [specialization, setSpecialization] = useState("Montessori & Early Childhood");
  const [experienceYears, setExperienceYears] = useState("3");
  const [teachingLicenseDoc, setTeachingLicenseDoc] = useState<File | null>(null);
  const [resumeCvDoc, setResumeCvDoc] = useState<File | null>(null);
  const [teacherIdDoc, setTeacherIdDoc] = useState<File | null>(null);

  // Step 3: Terms Checkbox
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const locale = useLocale();

  const handleSignupSuccess = (user: any, accessToken: string) => {
    dispatch(setCredentials({ token: accessToken, user }));
    localStorage.setItem("authToken", accessToken);
    toast.success("Account & Profile registered! Welcome to Kids-Oasis.");

    if (user.role === "admin") {
      router.push(`/${locale}/dashboard/admin`);
    } else if (user.role === "nurseryOwner" || user.role === "academyOwner" || user.role === "owner") {
      router.push(`/${locale}/dashboard/academy`);
    } else if (user.role === "teacher") {
      router.push(`/${locale}/dashboard/teacher`);
    } else {
      router.push(`/${locale}/dashboard/parent`);
    }
  };

  useEffect(() => {
    const token = searchParams.get("token");
    const userStr = searchParams.get("user");
    if (token) {
      try {
        let user: any = { role: "parent", firstName: "Google User" };
        if (userStr && userStr !== "undefined") {
          user = JSON.parse(decodeURIComponent(userStr));
        }
        handleSignupSuccess(user, token);
      } catch (err) {
        console.error("Failed to parse Google OAuth user callback data", err);
      }
    }
  }, [searchParams]);

  const validateStep1 = () => {
    if (!firstName || !lastName || !email || !phoneNumber || !password) {
      setErrMessage("Please fill in all mandatory account fields.");
      toast.error("Please fill in all mandatory account fields.");
      return false;
    }
    if (password !== passwordConfirm) {
      setErrMessage("Passwords do not match.");
      toast.error("Passwords do not match.");
      return false;
    }
    setErrMessage("");
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      toast.error("Please accept the Terms of Service & Child Protection Policy to complete registration.");
      return;
    }

    setLoading(true);
    setErrMessage("");

    const payload = {
      firstName,
      lastName,
      email,
      phoneNumber,
      address: address || "Alexandria, Egypt",
      gender,
      role: selectedRole,
      password,
      passwordConfirm,
      // Metadata fields
      academyName,
      registrationNumber,
      taxId,
      specialization,
      experienceYears,
      childName,
      childBirthday,
      childGender,
      childMedical,
      status: selectedRole === "nurseryOwner" ? "Pending Verification" : "Active",
    };

    try {
      const apiUrl = API_URL;
      const res = await axios.post(`${apiUrl}/auth/register`, payload, {
        withCredentials: true,
      });

      // If parent created child info, create initial child document
      if (selectedRole === "parent" && childName) {
        try {
          const userToken = res.data?.accessToken;
          if (userToken) {
            await axios.post(
              `${apiUrl}/children`,
              {
                name: childName,
                birthday: childBirthday,
                gender: childGender,
                medicalNotes: childMedical,
              },
              { headers: { Authorization: `Bearer ${userToken}` } }
            );
          }
        } catch (childErr) {
          console.warn("Child initial profile creation note:", childErr);
        }
      }

      handleSignupSuccess(res.data.user, res.data.accessToken);
    } catch (err: any) {
      const dataMsg = err.response?.data?.message;
      const msg = Array.isArray(dataMsg)
        ? dataMsg.join(", ")
        : dataMsg || "Registration failed. Please verify your details.";
      setErrMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 space-y-12">
        {/* Banner Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold">
            <Sparkles className="w-4 h-4 text-amber-500" /> Multi-Role Enterprise Onboarding
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Create Your Kids-Oasis Account
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Tailored registration and verification workflows for Parents, Academy Managers, and Educators.
          </p>
        </div>

        {/* Stepper Progress Indicator */}
        <div className="max-w-xl mx-auto flex items-center justify-between relative px-6">
          <div className="absolute left-10 right-10 top-1/2 -translate-y-1/2 h-1 bg-slate-200 dark:bg-slate-800 -z-0" />
          
          {[
            { num: 1, label: "1. Role & Credentials" },
            { num: 2, label: "2. Verification Data" },
            { num: 3, label: "3. Terms & Submit" },
          ].map((s) => {
            const isActive = step >= s.num;
            return (
              <div key={s.num} className="relative z-10 flex flex-col items-center gap-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs transition ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {s.num}
                </div>
                <span className="text-[11px] font-extrabold text-slate-600 dark:text-slate-400">
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stepper Form Body */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl mx-auto">
          {errMessage && (
            <div className="mb-6 p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs font-semibold text-red-600 dark:text-red-400 text-center">
              {errMessage}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* STEP 1: ROLE SELECTION & BASE CREDENTIALS */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-xs font-extrabold text-slate-700 dark:text-slate-200 uppercase tracking-wider block">
                    Select Your Registration Role:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      {
                        id: "parent",
                        title: "Parent / Guardian",
                        desc: "Enroll children, track attendance, & pay tuition securely",
                        icon: UserCheck,
                      },
                      {
                        id: "nurseryOwner",
                        title: "Academy Owner",
                        desc: "Register nursery, upload credentials, & manage enrollments",
                        icon: Building2,
                      },
                      {
                        id: "teacher",
                        title: "Educator / Teacher",
                        desc: "Upload teaching licenses & manage assigned classroom rosters",
                        icon: GraduationCap,
                      },
                    ].map((roleCard) => {
                      const isSelected = selectedRole === roleCard.id;
                      const Icon = roleCard.icon;
                      return (
                        <div
                          key={roleCard.id}
                          onClick={() => setSelectedRole(roleCard.id as any)}
                          className={`p-4 rounded-2xl border-2 transition cursor-pointer space-y-2 ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 shadow-md"
                              : "border-slate-200 dark:border-slate-800 hover:border-slate-300"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300">
                              <Icon className="w-5 h-5" />
                            </div>
                            {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600" />}
                          </div>
                          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                            {roleCard.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                            {roleCard.desc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Base Credentials Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      placeholder="e.g. Amira"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      placeholder="e.g. Hassan"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="parent@kidsoasis.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      placeholder="+20 100 123 4567"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      required
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
                  >
                    Continue to Role Verification <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ROLE-TAILORED EVIDENCE & DOCUMENT VERIFICATION */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* ROLE 1: PARENT */}
                {selectedRole === "parent" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-300">
                      <strong>Parent Identity & Child Profile Setup:</strong> Upload your parent ID verification proof and add your initial child profile for nursery application.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Upload Parent National ID / Passport Proof
                        </label>
                        <div className="p-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            {parentIdDoc ? parentIdDoc.name : "Choose ID document scan"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setParentIdDoc(e.target.files?.[0] || null)}
                            className="hidden"
                            id="parent-id-file"
                          />
                          <label
                            htmlFor="parent-id-file"
                            className="mt-1 inline-block px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-[10px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Upload Real Parent Profile Photo
                        </label>
                        <div className="p-3.5 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[11px] font-semibold text-slate-500 block">
                            {parentPhoto ? parentPhoto.name : "Choose real profile photo"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setParentPhoto(e.target.files?.[0] || null)}
                            className="hidden"
                            id="parent-photo-file"
                          />
                          <label
                            htmlFor="parent-photo-file"
                            className="mt-1 inline-block px-3 py-1 bg-white dark:bg-slate-700 rounded-md text-[10px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse Photo
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Initial Child Section */}
                    <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Heart className="w-4 h-4 text-red-500" /> Initial Child Profile (Optional)
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Child Full Name
                          </label>
                          <input
                            type="text"
                            value={childName}
                            onChange={(e) => setChildName(e.target.value)}
                            placeholder="e.g. Noah Hassan"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                            Date of Birth
                          </label>
                          <input
                            type="date"
                            value={childBirthday}
                            onChange={(e) => setChildBirthday(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ROLE 2: ACADEMY OWNER */}
                {selectedRole === "nurseryOwner" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-300">
                      <strong>Academy Verification & Contract Audit:</strong> Academy owners must submit commercial licensing evidence and owner ID. Upon submission, your account contract is reviewed by System Administrators before platform activation.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Academy Official Name *
                        </label>
                        <input
                          type="text"
                          value={academyName}
                          onChange={(e) => setAcademyName(e.target.value)}
                          placeholder="e.g. Oasis International Nursery"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Commercial Registration License # *
                        </label>
                        <input
                          type="text"
                          value={registrationNumber}
                          onChange={(e) => setRegistrationNumber(e.target.value)}
                          placeholder="CR-2026-987654"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Commercial License Document
                        </label>
                        <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[10px] font-semibold text-slate-500 block truncate">
                            {commercialLicenseDoc ? commercialLicenseDoc.name : "License PDF"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setCommercialLicenseDoc(e.target.files?.[0] || null)}
                            className="hidden"
                            id="commercial-doc-file"
                          />
                          <label
                            htmlFor="commercial-doc-file"
                            className="mt-1 inline-block px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Owner National ID Scan
                        </label>
                        <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[10px] font-semibold text-slate-500 block truncate">
                            {ownerIdDoc ? ownerIdDoc.name : "Owner ID Scan"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setOwnerIdDoc(e.target.files?.[0] || null)}
                            className="hidden"
                            id="owner-id-file"
                          />
                          <label
                            htmlFor="owner-id-file"
                            className="mt-1 inline-block px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Facility Lease / Deed
                        </label>
                        <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[10px] font-semibold text-slate-500 block truncate">
                            {propertyLeaseDoc ? propertyLeaseDoc.name : "Lease Deed"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setPropertyLeaseDoc(e.target.files?.[0] || null)}
                            className="hidden"
                            id="property-doc-file"
                          />
                          <label
                            htmlFor="property-doc-file"
                            className="mt-1 inline-block px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ROLE 3: EDUCATOR / TEACHER */}
                {selectedRole === "teacher" && (
                  <div className="space-y-5">
                    <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 text-xs text-sky-900 dark:text-sky-300">
                      <strong>Educator Credential Submission:</strong> Upload your teaching license, resume (CV), and ID to join accredited nursery teams.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Teaching Specialization *
                        </label>
                        <input
                          type="text"
                          value={specialization}
                          onChange={(e) => setSpecialization(e.target.value)}
                          placeholder="e.g. Montessori & Early STEM"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Years of Teaching Experience
                        </label>
                        <input
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          placeholder="3"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Teaching License / Educator Certificate
                        </label>
                        <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[10px] font-semibold text-slate-500 block truncate">
                            {teachingLicenseDoc ? teachingLicenseDoc.name : "License PDF"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setTeachingLicenseDoc(e.target.files?.[0] || null)}
                            className="hidden"
                            id="teaching-license-file"
                          />
                          <label
                            htmlFor="teaching-license-file"
                            className="mt-1 inline-block px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                          Resume / CV Document
                        </label>
                        <div className="p-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl text-center bg-slate-50 dark:bg-slate-800">
                          <Upload className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
                          <span className="text-[10px] font-semibold text-slate-500 block truncate">
                            {resumeCvDoc ? resumeCvDoc.name : "Resume CV PDF"}
                          </span>
                          <input
                            type="file"
                            onChange={(e) => setResumeCvDoc(e.target.files?.[0] || null)}
                            className="hidden"
                            id="resume-cv-file"
                          />
                          <label
                            htmlFor="resume-cv-file"
                            className="mt-1 inline-block px-2 py-0.5 bg-white dark:bg-slate-700 rounded text-[9px] font-bold text-indigo-600 dark:text-indigo-300 cursor-pointer border"
                          >
                            Browse File
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
                  >
                    Proceed to Terms & Review <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: TERMS & FINAL REGISTRATION */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Registration Summary & Contract Terms
                  </h4>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Registrant Name</span>
                      <strong className="text-slate-800 dark:text-slate-200">{firstName} {lastName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] font-bold uppercase block">Selected Role</span>
                      <strong className="text-indigo-600 dark:text-indigo-400 capitalize">{selectedRole}</strong>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    <p>
                      By completing registration, you confirm that all provided identity proofs and credentials are authentic. {selectedRole === "nurseryOwner" && "Your academy onboarding contract is subject to 10% platform commission and System Admin approval."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="terms-checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                    />
                    <label htmlFor="terms-checkbox" className="text-xs text-slate-700 dark:text-slate-300 font-semibold cursor-pointer">
                      I agree to the{" "}
                      <Link
                        href={`/${locale}/terms`}
                        target="_blank"
                        className="text-indigo-600 dark:text-indigo-400 underline font-bold"
                      >
                        Terms of Service & Role Governance Agreement
                      </Link>
                    </label>

                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-extrabold text-xs flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back to Verification
                  </button>

                  <button
                    type="submit"
                    disabled={loading || !acceptedTerms}
                    className="px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-500/30 transition disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? "Registering Account..." : "Complete Registration & Launch"}
                  </button>
                </div>
              </motion.div>
            )}
          </form>
        </div>

        {/* Marketing Role-Based FAQ Section */}
        <SignupFaqSection />
      </main>

      {/* Terms Modal */}
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />

      <Footer />
    </div>
  );
}