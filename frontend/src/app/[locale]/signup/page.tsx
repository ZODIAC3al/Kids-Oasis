"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/authSlice";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "react-toastify";
import { API_URL } from "@/lib/config";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name too short"),
    lastName: z.string().min(2, "Last name too short"),
    email: z.string().email("Invalid email address"),
    phoneNumber: z.string().min(8, "Invalid phone number"),
    address: z.string().min(5, "Address too short"),
    role: z.enum(["parent", "nurseryOwner", "serviceProvider"], {
      errorMap: () => ({ message: "Please select a role" }),
    }),
    gender: z.enum(["male", "female"], {
      errorMap: () => ({ message: "Please select gender" }),
    }),
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>;

import { motion } from "framer-motion";

export default function Signup() {
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const tAuth = useTranslations("auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (values: SignupFormValues) => {
    setLoading(true);
    setErrMessage("");
    const apiUrl = API_URL;
    axios
      .post(`${apiUrl}/auth/register`, values, { withCredentials: true })
      .then((res) => {
        const { accessToken, user } = res.data;
        dispatch(setCredentials({ token: accessToken, user }));
        localStorage.setItem("authToken", accessToken);
        toast.success("Account created successfully! Welcome to Kids-Oasis.");

        if (user.role === "admin") {
          router.push(`/${locale}/dashboard/admin`);
        } else if (user.role === "nurseryOwner" || user.role === "academyOwner" || user.role === "owner") {
          router.push(`/${locale}/dashboard/academy`);
        } else if (user.role === "teacher") {
          router.push(`/${locale}/dashboard/teacher`);
        } else {
          router.push(`/${locale}/dashboard/parent`);
        }
      })
      .catch((err) => {
        const dataMsg = err.response?.data?.message;
        const msg = Array.isArray(dataMsg)
          ? dataMsg.join(", ")
          : dataMsg || "Signup failed. Please try again.";
        setErrMessage(msg);
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    const apiUrl = API_URL;
    const mockGoogleProfile = {
      email: `parent_${Date.now().toString().slice(-4)}@kidsoasis.com`,
      firstName: "Amira",
      lastName: "Google User",
      avatar: "https://lh3.googleusercontent.com/a/default-avatar=s96-c",
    };

    axios
      .post(`${apiUrl}/auth/google`, mockGoogleProfile, { withCredentials: true })
      .then((res) => {
        const { accessToken, user } = res.data;
        dispatch(setCredentials({ token: accessToken, user }));
        router.push(`/${locale}/dashboard/parent`);
      })
      .catch((err) => {
        setErrMessage("Google Authentication failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen flex-col bg-surface text-on-surface overflow-hidden">
      <Navbar />

      <main className="flex-1 w-full h-[calc(100vh-68px)] grid grid-cols-1 lg:grid-cols-2 bg-surface overflow-hidden">
        {/* Animated Left Illustration Panel (Viewport Height, No Scroll) */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-tertiary-container/25 via-surface-container-low to-primary-container/20">
          {/* Glowing Ambient Background */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-tertiary/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center max-w-md text-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-full max-w-[360px]"
            >
              <Image
                src="/register.svg"
                alt="Kids Oasis Signup"
                fill
                priority
                className="object-contain drop-shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-5 space-y-1.5"
            >
              <span className="inline-block rounded-full bg-secondary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
                Join Oasis Academy Network
              </span>
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Unlock Premium Early Education
              </h2>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Create your account to access verified academy profiles, instant tour bookings, and direct enrollments.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Form Panel (Viewport Height, No Scroll, No Star Icon) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-4 w-full max-w-xl mx-auto h-full overflow-y-auto"
        >
          <div className="mb-3 text-center lg:text-start">
            <h1 className="font-display text-2xl font-extrabold uppercase tracking-wide text-on-surface sm:text-3xl">
              {tAuth("signupTitle")}
            </h1>
            <p className="mt-1 text-xs text-on-surface-variant">
              {tAuth("signupSubtitle")}
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mb-3 flex w-full items-center justify-center gap-3 rounded-lg border border-outline-variant bg-surface-container-lowest py-2 text-xs font-bold text-on-surface transition hover:bg-surface-container-low shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Sign up with Google
          </button>

          <div className="relative mb-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/60" /></div>
            <span className="relative bg-surface px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">or email registration</span>
          </div>

          {errMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-3 rounded-xl bg-error-container p-2.5 text-center text-xs font-semibold text-on-error-container border border-error/20"
            >
              <span>{errMessage}</span>
              {errMessage.includes("already in use") && (
                <Link href={`/${locale}/login`} className="font-bold underline hover:text-primary block mt-0.5">
                  Click here to log in
                </Link>
              )}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2.5" noValidate>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {tAuth("firstNameLabel")}
                </label>
                <Input placeholder="Amira" className="h-9 text-xs rounded-lg" {...register("firstName")} />
                {errors.firstName && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.firstName.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {tAuth("lastNameLabel")}
                </label>
                <Input placeholder="Hassan" className="h-9 text-xs rounded-lg" {...register("lastName")} />
                {errors.lastName && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {tAuth("emailLabel")}
              </label>
              <Input type="email" autoComplete="email" placeholder={tAuth("emailPlaceholder")} className="h-9 text-xs rounded-lg" {...register("email")} />
              {errors.email && (
                <p className="mt-0.5 text-[11px] font-medium text-error">{errors.email.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Phone Number
                </label>
                <Input placeholder="+20 123 456 7890" className="h-9 text-xs rounded-lg" {...register("phoneNumber")} />
                {errors.phoneNumber && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.phoneNumber.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Address
                </label>
                <Input placeholder="Alexandria, Egypt" className="h-9 text-xs rounded-lg" {...register("address")} />
                {errors.address && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.address.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {tAuth("roleLabel")}
                </label>
                <select
                  {...register("role")}
                  className="h-9 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-xs text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select Role</option>
                  <option value="parent">{tAuth("roleParent")}</option>
                  <option value="nurseryOwner">{tAuth("roleOwner")}</option>
                  <option value="serviceProvider">{tAuth("roleTeacher")}</option>
                </select>
                {errors.role && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.role.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Gender
                </label>
                <select
                  {...register("gender")}
                  className="h-9 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 text-xs text-on-surface outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <option value="">Select Gender</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
                {errors.gender && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5 pt-0.5 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  {tAuth("passwordLabel")}
                </label>
                <Input type="password" autoComplete="new-password" placeholder={tAuth("passwordPlaceholder")} className="h-9 text-xs rounded-lg" {...register("password")} />
                {errors.password && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                  Confirm Password
                </label>
                <Input type="password" autoComplete="new-password" placeholder={tAuth("passwordPlaceholder")} className="h-9 text-xs rounded-lg" {...register("passwordConfirm")} />
                {errors.passwordConfirm && (
                  <p className="mt-0.5 text-[11px] font-medium text-error">{errors.passwordConfirm.message}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" loading={loading} className="w-full justify-center text-xs font-bold h-10 rounded-lg shadow-elevation-1">
                {tAuth("createAccount")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-4 border-t border-outline-variant/60 pt-3 text-center text-xs text-on-surface-variant">
            {tAuth("alreadyHaveAccount")}{" "}
            <Link href={`/${locale}/login`} className="font-bold text-primary hover:underline ms-1">
              {tAuth("loginButton")}
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// Same illustration used on the login page, kept local to this file so the
// page stays a single self-contained component. Purely decorative — uses
// theme color tokens so it follows light/dark automatically.
function AuthIllustration() {
  return (
    <div className="relative flex h-full w-full max-w-md items-center justify-center p-4">
      <div className="relative aspect-square w-full max-w-[360px] overflow-hidden rounded-2xl">
        <Image
          src="/register.svg"
          alt="Kids Oasis Signup Illustration"
          fill
          priority
          className="object-contain"
        />
      </div>
    </div>
  );
}