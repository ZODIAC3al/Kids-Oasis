"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, ArrowRight } from "lucide-react";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords do not match",
    path: ["passwordConfirm"],
  });

type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordFormContent() {
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const tAuth = useTranslations("auth");
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = (values: ResetFormValues) => {
    if (!token) {
      setMsg("Invalid or missing reset token. Please request a new password reset link.");
      return;
    }

    setLoading(true);
    setMsg("");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

    axios
      .post(`${apiUrl}/auth/reset-password`, {
        token,
        password: values.password,
      })
      .then((res) => {
        setSuccess(true);
        setMsg(res.data.message || "Password reset successfully!");
        setTimeout(() => {
          router.push(`/${locale}/login`);
        }, 2000);
      })
      .catch((err) => {
        setMsg(err.response?.data?.message || "Failed to reset password.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="card-surface w-full max-w-md p-8 shadow-elevation-2">
      <div className="text-center mb-8">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-elevation-1 mb-4">
          <Lock className="h-6 w-6" />
        </span>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Set New Password
        </h1>
        <p className="mt-1 text-sm text-on-surface-variant">
          Enter a new secure password for your Kids Oasis account
        </p>
      </div>

      {msg && (
        <div
          className={`mb-6 rounded-xl p-3 text-center text-xs font-semibold ${
            success
              ? "bg-tertiary-container/30 text-tertiary border border-tertiary/20"
              : "bg-error-container p-3 text-on-error-container"
          }`}
        >
          {msg}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            New Password
          </label>
          <Input
            type="password"
            placeholder={tAuth("passwordPlaceholder")}
            {...register("password")}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-error">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
            Confirm New Password
          </label>
          <Input
            type="password"
            placeholder={tAuth("passwordPlaceholder")}
            {...register("passwordConfirm")}
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-xs text-error">{errors.passwordConfirm.message}</p>
          )}
        </div>

        <Button type="submit" loading={loading} className="w-full justify-center">
          Update Password <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </form>

      <div className="mt-8 pt-6 border-t border-outline-variant text-center text-xs text-on-surface-variant">
        <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="text-sm font-semibold">Loading...</div>}>
          <ResetPasswordFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
