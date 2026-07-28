"use client";

import React from "react";
import { ShieldCheck, CheckCircle2, Award, FileCheck, Building2, User, Sparkles, Lock, Check } from "lucide-react";
import { useLocale } from "next-intl";

export interface ReceiptData {
  receiptId: string;
  parentName: string;
  parentEmail: string;
  childName: string;
  academyName: string;
  programName: string;
  amount: number;
  paymentMethod: string;
  paidAt: string;
  transactionRef: string;
}

export default function PrintableContractReceipt({ data }: { data: ReceiptData }) {
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!data) return null;

  const tuitionFee = data.amount || 1800;
  const adminFee = Math.round(tuitionFee * 0.05);
  const totalAmount = tuitionFee + adminFee;

  return (
    <div
      id="receipt-printable-contract"
      dir={isAr ? "rtl" : "ltr"}
      className="relative w-full max-w-2xl mx-auto bg-white text-slate-900 p-8 sm:p-12 rounded-3xl border-[6px] border-double border-[#1E1B4B] shadow-2xl overflow-hidden font-sans print:shadow-none print:m-0 print:w-full print:max-w-none print:rounded-none print:border-[6px]"
      style={{
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(248, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 100%)",
      }}
    >
      {/* Gold Flourish Corner Accents */}
      <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-500" />
      <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-500" />
      <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-500" />
      <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-500" />

      {/* Background Watermark Crest */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
        <div className="text-[140px] font-black text-[#1E1B4B] tracking-tighter">
          KIDS OASIS
        </div>
      </div>

      {/* Top Gold & Royal Navy Header Bar */}
      <div className="h-4 -mx-12 -mt-12 mb-8 bg-gradient-to-r from-[#1E1B4B] via-[#D97706] to-[#1E1B4B] shadow-sm" />

      {/* Header Branding & Contract Serial */}
      <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E1B4B] flex items-center justify-center text-amber-400 font-black text-xl shadow-lg border-2 border-amber-400">
              KO
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-[#1E1B4B] uppercase">
                {isAr ? "منصة كيدز أوايسس التعليمية" : "Kids-Oasis Platform"}
              </h1>
              <p className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest">
                {isAr ? "منظومة التعليم المبكر وحجز الأكاديميات الحصرية" : "Early Education & Nursery Marketplace Ecosystem"}
              </p>
            </div>
          </div>
        </div>

        <div className="text-right space-y-1">
          <div className="inline-block px-4 py-1.5 rounded-lg bg-[#1E1B4B] text-amber-300 font-mono text-xs font-black tracking-widest border border-amber-400/50 shadow-sm">
            {isAr ? `عقد رقم #${data.receiptId || "KO-2026-CERT"}` : `CONTRACT #${data.receiptId || "KO-2026-CERT"}`}
          </div>
          <p className="text-[11px] font-bold text-slate-500 pt-1">
            {isAr ? "تاريخ الإصدار: " : "Date Issued: "}{" "}
            <span className="font-extrabold text-slate-900">{data.paidAt || new Date().toLocaleDateString()}</span>
          </p>
        </div>
      </div>

      {/* Document Legal Title Ribbon */}
      <div className="relative text-center py-4 mb-7 bg-gradient-to-r from-[#1E1B4B] via-[#2E2A72] to-[#1E1B4B] text-white rounded-2xl border-2 border-amber-400/40 shadow-md">
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-amber-300 flex items-center justify-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          {isAr
            ? "عقد التسجيل التعليمي الرسمي وشهادة تسوية المصروفات"
            : "OFFICIAL EDUCATIONAL ENROLLMENT CONTRACT & TUITION SETTLEMENT DIPLOMA"}
        </h2>
        <p className="text-[11px] text-indigo-100/90 font-semibold mt-1">
          {isAr
            ? "إثبات رسمي ملزم قانونًا لبدء دراسة الطالب ومعالجة السداد عبر بوابة Stripe"
            : "Legally binding proof of student enrollment settlement processed via Stripe Payment Gateway"}
        </p>
      </div>

      {/* Contracting Parties Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7 text-xs">
        {/* Party I: Parent & Child */}
        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-[#1E1B4B]" />
            <span className="font-black text-[#1E1B4B] uppercase tracking-wider text-[10px]">
              {isAr ? "الطرف الأول — ولي الأمر والطفل" : "PARTY I — LEGAL GUARDIAN & STUDENT"}
            </span>
          </div>
          <div className="space-y-1.5 text-slate-700">
            <p>
              {isAr ? "ولي الأمر: " : "Parent / Guardian: "}{" "}
              <strong className="text-slate-900 font-extrabold text-sm">{data.parentName || "Valued Parent"}</strong>
            </p>
            <p>
              {isAr ? "البريد الإلكتروني: " : "Email Contact: "}{" "}
              <strong className="text-slate-800 font-semibold">{data.parentEmail}</strong>
            </p>
            <div className="pt-2 border-t border-slate-200/80 mt-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                {isAr ? "الطالب المسجل" : "ENROLLED STUDENT"}
              </span>
              <span className="text-base font-black text-[#1E1B4B]">{data.childName || "Student Applicant"}</span>
            </div>
          </div>
        </div>

        {/* Party II: Academy Provider */}
        <div className="p-4.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-sm space-y-2.5">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Building2 className="w-4 h-4 text-[#1E1B4B]" />
            <span className="font-black text-[#1E1B4B] uppercase tracking-wider text-[10px]">
              {isAr ? "الطرف الثاني — الأكاديمية والروضة" : "PARTY II — EDUCATIONAL INSTITUTION"}
            </span>
          </div>
          <div className="space-y-1.5 text-slate-700">
            <p>
              {isAr ? "اسم الأكاديمية: " : "Academy Name: "}{" "}
              <strong className="text-slate-900 font-extrabold text-sm">{data.academyName || "Oasis Partner Academy"}</strong>
            </p>
            <p>
              {isAr ? "البرنامج الأكاديمي: " : "Enrolled Program: "}{" "}
              <strong className="text-slate-800 font-semibold">{data.programName || "Standard Academic Track"}</strong>
            </p>
            <div className="pt-2 border-t border-slate-200/80 mt-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase block">
                {isAr ? "حالة الاعتماد والتوثيق" : "ACCREDITATION STATUS"}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> {isAr ? "معتمد وموثق تجاريًا" : "Verified Partner Facility"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Itemized Financial Consideration Table */}
      <div className="border-2 border-slate-900 rounded-2xl overflow-hidden mb-7 text-xs">
        <div className="bg-[#1E1B4B] text-amber-300 px-4 py-2.5 font-extrabold flex justify-between uppercase tracking-wider">
          <span>{isAr ? "تفاصيل المصروفات والرسوم" : "Financial Itemization"}</span>
          <span>{isAr ? "القيمة (ج.م)" : "Amount (EGP)"}</span>
        </div>
        <div className="divide-y divide-slate-200 bg-slate-50/50">
          <div className="p-3 flex justify-between text-slate-800 font-medium">
            <span>{isAr ? `رسوم البرنامج الدراسي - ${data.programName || "المنهج الأساسي"}` : `Tuition Fee — ${data.programName || "Standard Curriculum"}`}</span>
            <span className="font-mono font-extrabold text-slate-900">{tuitionFee.toLocaleString()} EGP</span>
          </div>
          <div className="p-3 flex justify-between text-slate-800 font-medium">
            <span>{isAr ? "رسوم الخدمة والتأمين الطلابي (5%)" : "Platform Registration & Student Insurance Fee (5%)"}</span>
            <span className="font-mono font-extrabold text-slate-900">{adminFee.toLocaleString()} EGP</span>
          </div>
          <div className="p-3.5 bg-indigo-50/80 flex justify-between text-slate-900 font-black text-sm">
            <span className="uppercase tracking-wide text-[#1E1B4B]">{isAr ? "إجمالي المبلغ المسدد بالكامل" : "Total Settlement Consideration Paid"}</span>
            <span className="font-mono text-indigo-900 text-base">{totalAmount.toLocaleString()} EGP</span>
          </div>
        </div>
      </div>

      {/* Official Paid Stamp Badge & Legal Terms */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t-2 border-slate-200 pt-6">
        {/* Paid Stamp Graphic */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-50 border-2 border-emerald-600 text-emerald-800">
          <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-black">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-black text-xs uppercase tracking-wider text-emerald-900">
              {isAr ? "مسدد بالكامل ومسجل رسميًا" : "FULLY PAID & ENROLLED"}
            </span>
            <span className="text-[10px] font-mono text-emerald-700 font-bold">
              {isAr ? `المرجع: ${data.transactionRef || "Stripe_Verified"}` : `REF: ${data.transactionRef || "Stripe_Verified"}`}
            </span>
          </div>
        </div>

        {/* Digital Signature Lines & Stamp */}
        <div className="flex items-center gap-6 text-center">
          <div className="space-y-1">
            <div className="w-32 h-9 border-b-2 border-slate-900 flex items-end justify-center pb-0.5">
              <span className="font-serif italic text-indigo-900 font-bold text-xs">{data.parentName || "Digital Signature"}</span>
            </div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase block">{isAr ? "توقيع ولي الأمر" : "Parent / Guardian Signature"}</span>
          </div>

          <div className="space-y-1">
            <div className="w-24 h-12 rounded-full border-2 border-dashed border-amber-600 bg-amber-500/10 flex items-center justify-center p-1 mx-auto text-[9px] font-black text-amber-900 uppercase">
              [KO-SEAL-VERIFIED]
            </div>
            <span className="text-[9px] font-extrabold text-slate-400 uppercase block">{isAr ? "ختم كيدز أوايسس" : "Platform Official Seal"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
