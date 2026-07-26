"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useTranslations, useLocale } from "next-intl";
import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ArrowRight, KeyRound } from "lucide-react";

import { API_URL } from "@/lib/config";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [msg, setMsg] = useState("");
  const [demoToken, setDemoToken] = useState("");
  const [loading, setLoading] = useState(false);
  const tAuth = useTranslations("auth");
  const locale = useLocale();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = (values: ForgotFormValues) => {
    setLoading(true);
    setMsg("");
    setDemoToken("");
    const apiUrl = API_URL;

    axios
      .post(`${apiUrl}/auth/forgot-password`, values)
      .then((res) => {
        setMsg(res.data.message || "Password reset link issued.");
        if (res.data.resetToken) {
          setDemoToken(res.data.resetToken);
        }
      })
      .catch((err) => {
        setMsg(err.response?.data?.message || "Failed to process request.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="card-surface w-full max-w-md p-8 shadow-elevation-2">
          <div className="text-center mb-8">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-on-primary shadow-elevation-1 mb-4">
              <KeyRound className="h-6 w-6" />
            </span>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              {tAuth("forgotPassword")}
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Enter your email address to receive password reset instructions
            </p>
          </div>

          {msg && (
            <div className="mb-6 rounded-xl bg-primary-container/20 p-4 text-center text-xs font-semibold text-primary border border-primary/20 space-y-2">
              <p>{msg}</p>
              {demoToken && (
                <div className="pt-2 border-t border-primary/20">
                  <p className="text-[11px] text-on-surface-variant mb-1">Testing reset link:</p>
                  <Link
                    href={`/${locale}/reset-password?token=${demoToken}`}
                    className="underline font-bold text-primary hover:brightness-125 break-all text-xs"
                  >
                    Reset Password Now →
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
                {tAuth("emailLabel")}
              </label>
              <Input
                type="email"
                placeholder={tAuth("emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" loading={loading} className="w-full justify-center">
              Send Reset Instructions <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-outline-variant text-center text-xs text-on-surface-variant">
            Remembered your password?{" "}
            <Link href={`/${locale}/login`} className="font-semibold text-primary hover:underline">
              {tAuth("loginButton")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
