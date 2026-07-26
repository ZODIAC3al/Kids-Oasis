"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "@/store/authSlice";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, LogIn } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

import { motion } from "framer-motion";

export default function Login() {
  const [errMessage, setErrMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  const dispatch = useDispatch();
  const locale = useLocale();
  const tAuth = useTranslations("auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const [mfaChallenge, setMfaChallenge] = useState<{ required: boolean; userId: string }>({ required: false, userId: '' });
  const [mfaPin, setMfaPin] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  const handleLoginSuccess = (user: any, accessToken: string) => {
    dispatch(setCredentials({ token: accessToken, user }));
    if (rememberMe) {
      localStorage.setItem("authToken", accessToken);
    }
    toast.success(`Welcome back, ${user.firstName || 'User'}!`);
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

  const onSubmit = (values: LoginFormValues) => {
    setLoading(true);
    setErrMessage("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    axios
      .post(`${apiUrl}/auth/login`, values, { withCredentials: true })
      .then((res) => {
        if (res.data.mfaRequired) {
          setMfaChallenge({ required: true, userId: res.data.userId });
          toast.info("Two-Factor Authentication required.");
          return;
        }
        const { accessToken, user } = res.data;
        handleLoginSuccess(user, accessToken);
      })
      .catch((err) => {
        const dataMsg = err.response?.data?.message;
        const msg = Array.isArray(dataMsg)
          ? dataMsg.join(", ")
          : dataMsg || "Login failed. Please check your email and password.";
        setErrMessage(msg);
        toast.error(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleMfaValidate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mfaPin || mfaPin.length < 6) return;
    setMfaLoading(true);
    setErrMessage("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    axios
      .post(`${apiUrl}/auth/mfa/validate`, { userId: mfaChallenge.userId, token: mfaPin }, { withCredentials: true })
      .then((res) => {
        const { accessToken, user } = res.data;
        handleLoginSuccess(user, accessToken);
      })
      .catch((err) => {
        setErrMessage("Invalid 2FA code. Please check your Google Authenticator app.");
      })
      .finally(() => {
        setMfaLoading(false);
      });
  };

  const handleGoogleAuth = () => {
    setLoading(true);
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";
    // Mock interactive Google OAuth account chooser payload
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
        handleLoginSuccess(user, accessToken);
      })
      .catch((err) => {
        setErrMessage("Google Authentication failed.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex h-screen flex-col bg-surface text-on-surface overflow-hidden relative">
      <Navbar />

      <main className="flex-1 w-full h-[calc(100vh-68px)] grid grid-cols-1 lg:grid-cols-2 bg-surface overflow-hidden">
        {/* Animated Left Illustration Panel (Viewport Height, No Scroll) */}
        <div className="relative hidden lg:flex flex-col items-center justify-center p-8 overflow-hidden bg-gradient-to-br from-primary-container/25 via-surface-container-low to-secondary-container/20">
          {/* Glowing Ambient Background */}
          <div className="absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-tertiary/20 blur-3xl animate-pulse" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center max-w-md text-center"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative aspect-square w-full max-w-[380px]"
            >
              <Image
                src="/Sign up.svg"
                alt="Kids Oasis Login"
                fill
                priority
                className="object-contain drop-shadow-xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="mt-6 space-y-1.5"
            >
              <span className="inline-block rounded-full bg-primary/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                Kids Oasis Academy Portal
              </span>
              <h2 className="font-display text-2xl font-bold text-on-surface">
                Empowering Early Education
              </h2>
              <p className="text-xs text-on-surface-variant max-w-sm">
                Seamlessly connecting parents, nurseries, academies, and teachers across Alexandria, Cairo, and Giza.
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Right Form Panel (Viewport Height, No Scroll, No Star Icon) */}
        <motion.div
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-6 w-full max-w-xl mx-auto h-full overflow-y-auto"
        >
          <div className="mb-4 text-center lg:text-start">
            <h1 className="font-display text-3xl font-extrabold uppercase tracking-wide text-on-surface sm:text-4xl">
              {tAuth("loginButton")}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-on-surface-variant">
              Welcome back — sign in to continue to Kids Oasis
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-outline-variant bg-surface-container-lowest py-2.5 text-xs font-bold text-on-surface transition hover:bg-surface-container-low shadow-sm"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative mb-4 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-outline-variant/60" /></div>
            <span className="relative bg-surface px-3 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">or email login</span>
          </div>

          {errMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 rounded-xl bg-error-container p-3 text-center text-xs font-semibold text-on-error-container border border-error/20"
            >
              {errMessage}
            </motion.div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5" noValidate>
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
              >
                {tAuth("emailLabel")}
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={tAuth("emailPlaceholder")}
                className="h-10 text-xs rounded-xl"
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-error">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-xs font-bold uppercase tracking-wider text-on-surface-variant"
              >
                {tAuth("passwordLabel")}
              </label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder={tAuth("passwordPlaceholder")}
                className="h-10 text-xs rounded-xl"
                {...register("password")}
              />
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-error">{errors.password.message}</p>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label htmlFor="rememberMe" className="flex items-center gap-2 font-semibold text-on-surface-variant cursor-pointer">
                <input
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-outline-variant accent-primary cursor-pointer"
                />
                Remember me
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="font-bold text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="pt-1">
              <Button type="submit" loading={loading} className="w-full justify-center text-xs font-bold h-10 rounded-xl shadow-elevation-1">
                {tAuth("loginButton")} <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>

          <div className="mt-5 border-t border-outline-variant/60 pt-3 text-center text-xs text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link href={`/${locale}/signup`} className="font-bold text-primary hover:underline ms-1">
              Sign Up
            </Link>
          </div>
        </motion.div>
      </main>

      {/* MFA 2FA Authentication Challenge Modal */}
      {mfaChallenge.required && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md rounded-2xl bg-surface p-6 shadow-elevation-5 border border-outline-variant space-y-4"
          >
            <div className="text-center space-y-1">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-1">
                🔐
              </span>
              <h3 className="text-lg font-bold text-on-surface">2-Factor Authentication Required</h3>
              <p className="text-xs text-on-surface-variant">
                Enter the 6-digit verification code from your Authenticator app.
              </p>
            </div>

            <form onSubmit={handleMfaValidate} className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={mfaPin}
                onChange={(e) => setMfaPin(e.target.value)}
                placeholder="123456"
                className="w-full text-center text-2xl font-mono tracking-widest h-12 rounded-xl border border-outline-variant bg-surface-container-lowest font-bold text-primary outline-none focus:ring-2 focus:ring-primary"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setMfaChallenge({ required: false, userId: '' })}
                  className="w-1/2 py-2.5 text-xs font-bold text-on-surface-variant hover:bg-surface-container-low rounded-xl border border-outline-variant"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  loading={mfaLoading}
                  className="w-1/2 justify-center text-xs font-bold py-2.5 rounded-xl"
                >
                  Verify Code
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}