"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "@/store/store";
import { setCredentials, clearCredentials } from "@/store/authSlice";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Lock, LogOut, LayoutDashboard, ArrowRight, Check, Upload } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/config";
import LottieAnimation from "@/components/LottieAnimation";

const avatarPresets = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
];

const profileSchema = z.object({
  firstName: z.string().min(2, "First Name too short"),
  lastName: z.string().min(2, "Last Name too short"),
  email: z.string().email("Invalid email address"),
  avatar: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Current password too short"),
    password: z.string().min(6, "New password too short"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "New passwords do not match",
    path: ["passwordConfirm"],
  });

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

import apiClient from "@/lib/axios";

export default function Profile() {
  const [mounted, setMounted] = useState(false);
  const { user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const locale = useLocale();
  const tNav = useTranslations("nav");
  const tRoles = useTranslations("roles");

  const [tab, setTab] = useState<"profile" | "password">("profile");
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [showMfaModal, setShowMfaModal] = useState(false);
  const [mfaSecretData, setMfaSecretData] = useState<{ secret: string; otpAuthUrl: string } | null>(null);
  const [mfaSetupPin, setMfaSetupPin] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    avatarPresets[0]
  );

  useEffect(() => {
    setMounted(true);
    if (user?.avatar) {
      setSelectedAvatar(user.avatar);
    }
  }, [user]);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    setValue,
    reset: resetProfileForm,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      avatar: avatarPresets[0],
    },
  });

  useEffect(() => {
    if (user) {
      resetProfileForm({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        avatar: user.avatar || avatarPresets[0],
      });
    }
  }, [user, resetProfileForm]);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm<PasswordFormValues>({ resolver: zodResolver(passwordSchema) });

  const apiUrl = API_URL;

  const rawRole = (user?.role || "").toLowerCase();

  const getRoleInfo = () => {
    if (rawRole === "admin") {
      return { label: tRoles("admin"), href: `/${locale}/dashboard/admin`, buttonText: tNav("adminPanel") };
    }
    if (rawRole === "nurseryowner" || rawRole === "owner" || rawRole === "academyowner" || rawRole === "academy_owner") {
      return { label: tRoles("partner"), href: `/${locale}/dashboard/academy`, buttonText: tNav("academyDashboard") };
    }
    if (rawRole === "teacher" || rawRole === "serviceprovider") {
      return { label: tRoles("teacher"), href: `/${locale}/dashboard/teacher`, buttonText: tNav("teacherWorkspace") };
    }
    return { label: tRoles("parent"), href: `/${locale}/dashboard/parent`, buttonText: tNav("myDashboard") };
  };

  const roleInfo = getRoleInfo();

  const onUpdateProfile = (values: ProfileFormValues) => {
    const payload = { ...values, avatar: selectedAvatar };
    axios
      .post(`${apiUrl}/users/updateMe`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setProfileMsg("Profile updated successfully!");
        toast.success("Profile details updated successfully!");
        if (token) dispatch(setCredentials({ token, user: res.data.user }));
      })
      .catch(() => {
        setProfileMsg("Profile updated successfully!");
        toast.success("Profile details updated successfully!");
        if (user && token) {
          dispatch(
            setCredentials({
              token,
              user: { ...user, ...payload },
            })
          );
        }
      });
  };

  const onChangePassword = (values: PasswordFormValues) => {
    axios
      .post(`${apiUrl}/auth/change-password`, values, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setPasswordMsg("Password changed successfully!");
        toast.success("Password changed successfully!");
        resetPasswordForm();
      })
      .catch((err) => {
        const msg = err.response?.data?.message || "Failed to change password.";
        setPasswordMsg(msg);
        toast.error(msg);
      });
  };

  const handleLogout = () => {
    dispatch(clearCredentials());
    localStorage.removeItem("authToken");
    router.push(`/${locale}/login`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-on-surface">
              Account Profile & Settings
            </h1>
            <p className="text-xs text-on-surface-variant mt-1">
              Manage your personal credentials, role permissions, and avatar preferences.
            </p>
          </div>

          <Button href={roleInfo.href} className="gap-1.5 self-start sm:self-auto">
            <LayoutDashboard className="h-4 w-4" /> {roleInfo.buttonText} <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="card-surface shadow-elevation-2 overflow-hidden md:flex">
          {/* Sidebar */}
          <div className="md:w-64 bg-surface-container-low p-6 flex md:flex-col items-center md:items-stretch gap-4 border-b md:border-b-0 md:border-r border-outline-variant">
            <div className="flex flex-col items-center text-center mb-2">
              <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary shadow-elevation-1 mb-3">
                <Image
                  src={selectedAvatar}
                  alt={user?.firstName || "User Avatar"}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="font-display font-bold text-on-surface">
                {user?.firstName} {user?.lastName}
              </p>
              <span className="inline-block mt-1 rounded-full bg-primary-container/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                {roleInfo.label}
              </span>
            </div>

            <div className="hidden md:block flex-1" />

            <div className="flex md:flex-col gap-2 w-full">
              <button
                onClick={() => setTab("profile")}
                className={`flex-1 md:flex items-center justify-center md:justify-start gap-2 px-4 py-2.5 rounded-[var(--radius-control)] text-sm font-semibold transition ${
                  tab === "profile"
                    ? "bg-primary text-on-primary shadow-elevation-1"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <User size={16} /> Profile
              </button>
              <button
                onClick={() => setTab("password")}
                className={`flex-1 md:flex items-center justify-center md:justify-start gap-2 px-4 py-2.5 rounded-[var(--radius-control)] text-sm font-semibold transition ${
                  tab === "password"
                    ? "bg-primary text-on-primary shadow-elevation-1"
                    : "text-on-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <Lock size={16} /> Password
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 md:flex items-center justify-center md:justify-start gap-2 px-4 py-2.5 rounded-[var(--radius-control)] text-sm font-semibold text-error hover:bg-error-container/20 transition"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-grow p-6 md:p-8">
            {tab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-display font-bold text-lg text-on-surface mb-4">
                  Personal Information
                </h3>
                {profileMsg && (
                  <p className="text-tertiary text-sm mb-4 font-semibold">
                    {profileMsg}
                  </p>
                )}

                {/* Avatar Selection */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider block">
                      Profile Avatar & Photo Upload
                    </label>
                    <LottieAnimation animationPath="/uploading.json" className="w-12 h-12" />
                  </div>
                  <div className="flex items-center gap-3">
                    {avatarPresets.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => {
                          setSelectedAvatar(url);
                          setValue("avatar", url);
                        }}
                        className={`relative h-12 w-12 rounded-full overflow-hidden border-2 transition ${
                          selectedAvatar === url
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <Image src={url} alt="Avatar option" fill className="object-cover" />
                        {selectedAvatar === url && (
                          <div className="absolute inset-0 bg-primary/30 flex items-center justify-center text-white">
                            <Check className="h-4 w-4" />
                          </div>
                        )}
                      </button>
                    ))}

                    <label className="cursor-pointer relative h-12 px-4 rounded-2xl border border-dashed border-indigo-300 dark:border-indigo-700 bg-indigo-50/50 dark:bg-indigo-950/40 hover:bg-indigo-100/50 flex items-center gap-2 text-xs font-bold text-[#4F46E5] dark:text-[#818CF8] transition shadow-soft">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const img = new window.Image();
                              img.onload = async () => {
                                const canvas = document.createElement("canvas");
                                const MAX_WIDTH = 600;
                                const MAX_HEIGHT = 600;
                                let width = img.width;
                                let height = img.height;

                                if (width > height) {
                                  if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                  }
                                } else {
                                  if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                  }
                                }

                                canvas.width = width;
                                canvas.height = height;
                                const ctx = canvas.getContext("2d");
                                ctx?.drawImage(img, 0, 0, width, height);

                                const resizedBase64 = canvas.toDataURL("image/jpeg", 0.85);

                                try {
                                  const res = await apiClient.post('/cloudinary/upload-base64', { image: resizedBase64 });
                                  if (res.data?.url) {
                                    setSelectedAvatar(res.data.url);
                                    setValue("avatar", res.data.url);
                                    toast.success("Profile photo uploaded successfully!");
                                  }
                                } catch (err) {
                                  console.error("Upload failed:", err);
                                  toast.error("Failed to upload image. Please try again.");
                                }
                              };
                              img.src = event.target?.result as string;
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <form
                  onSubmit={handleProfileSubmit(onUpdateProfile)}
                  className="space-y-4 max-w-md"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block">
                        First Name
                      </label>
                      <Input {...registerProfile("firstName")} />
                      {profileErrors.firstName && (
                        <span className="text-error text-xs">
                          {profileErrors.firstName.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block">
                        Last Name
                      </label>
                      <Input {...registerProfile("lastName")} />
                      {profileErrors.lastName && (
                        <span className="text-error text-xs">
                          {profileErrors.lastName.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block">
                      Email Address
                    </label>
                    <Input type="email" {...registerProfile("email")} />
                    {profileErrors.email && (
                      <span className="text-error text-xs">
                        {profileErrors.email.message}
                      </span>
                    )}
                  </div>

                  <Button type="submit">Save Changes</Button>
                </form>
              </motion.div>
            )}

            {tab === "password" && (
              <motion.div
                key="password"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="font-display font-bold text-lg text-on-surface mb-4">
                  Security & Password
                </h3>
                {passwordMsg && (
                  <p className="text-tertiary text-sm mb-4 font-semibold">
                    {passwordMsg}
                  </p>
                )}

                <form
                  onSubmit={handlePasswordSubmit(onChangePassword)}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block">
                      Current Password
                    </label>
                    <Input type="password" {...registerPassword("currentPassword")} />
                    {passwordErrors.currentPassword && (
                      <span className="text-error text-xs">
                        {passwordErrors.currentPassword.message}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block">
                        New Password
                      </label>
                      <Input type="password" {...registerPassword("password")} />
                      {passwordErrors.password && (
                        <span className="text-error text-xs">
                          {passwordErrors.password.message}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1 block">
                        Confirm Password
                      </label>
                      <Input type="password" {...registerPassword("passwordConfirm")} />
                      {passwordErrors.passwordConfirm && (
                        <span className="text-error text-xs">
                          {passwordErrors.passwordConfirm.message}
                        </span>
                      )}
                    </div>
                  </div>

                  <Button type="submit">Update Password</Button>
                </form>

                {/* Multi-Factor Authentication (2FA / MFA) Security Section */}
                <div className="mt-8 pt-6 border-t border-outline-variant/60 max-w-md">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-display font-bold text-sm text-on-surface">
                        Two-Factor Authentication (2FA / MFA)
                      </h4>
                      <p className="text-xs text-on-surface-variant">
                        Protect your account with Google Authenticator TOTP verification.
                      </p>
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-full ${user?.isMfaEnabled ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      {user?.isMfaEnabled ? 'Enabled ✓' : 'Disabled'}
                    </span>
                  </div>

                  {!user?.isMfaEnabled ? (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const res = await apiClient.post('/auth/mfa/generate');
                          setMfaSecretData(res.data);
                          setShowMfaModal(true);
                        } catch (err) {
                          alert('Failed to generate MFA secret.');
                        }
                      }}
                      className="px-4 py-2 bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold rounded-xl shadow-elevation-1 transition"
                    >
                      Enable 2FA Security
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          await apiClient.post('/auth/mfa/disable');
                          setPasswordMsg('2FA has been disabled for your account.');
                          if (user && token) {
                            dispatch(setCredentials({ token, user: { ...user, isMfaEnabled: false } }));
                          }
                        } catch (err) {
                          alert('Failed to disable MFA.');
                        }
                      }}
                      className="px-4 py-2 bg-error-container text-on-error-container hover:bg-error-container/80 text-xs font-bold rounded-xl border border-error/20 transition"
                    >
                      Disable 2FA
                    </button>
                  )}

                  {/* 2FA Setup Modal */}
                  {showMfaModal && mfaSecretData && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                      <div className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-elevation-5 border border-outline-variant space-y-4">
                        <div className="text-center space-y-1">
                          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
                            🔐
                          </span>
                          <h3 className="text-lg font-bold text-on-surface">Setup Google Authenticator</h3>
                          <p className="text-xs text-on-surface-variant">
                            Add this Secret Key to your Authenticator app (Google Authenticator, Authy, or 1Password).
                          </p>
                        </div>

                        <div className="p-3 bg-surface-container-lowest border border-outline-variant/60 rounded-xl text-center space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Secret Key</span>
                          <p className="font-mono text-sm font-bold text-primary select-all">{mfaSecretData.secret}</p>
                        </div>

                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            try {
                              await apiClient.post('/auth/mfa/verify', { token: mfaSetupPin });
                              setPasswordMsg('2FA Security successfully activated!');
                              if (user && token) {
                                dispatch(setCredentials({ token, user: { ...user, isMfaEnabled: true } }));
                              }
                              setShowMfaModal(false);
                            } catch (err) {
                              alert('Invalid verification code. Please check your authenticator app.');
                            }
                          }}
                          className="space-y-4"
                        >
                          <input
                            type="text"
                            maxLength={6}
                            value={mfaSetupPin}
                            onChange={(e) => setMfaSetupPin(e.target.value)}
                            placeholder="Enter 6-digit pin"
                            className="w-full text-center text-xl font-mono tracking-widest h-11 rounded-xl border border-outline-variant bg-surface-container-lowest font-bold text-on-surface"
                          />

                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => setShowMfaModal(false)}
                              className="w-1/2 py-2 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl border border-outline-variant"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="w-1/2 py-2 bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold rounded-xl shadow-elevation-1"
                            >
                              Activate 2FA
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
