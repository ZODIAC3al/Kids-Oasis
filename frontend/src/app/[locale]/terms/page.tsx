"use client";

import Link from "next/link";
import { ShieldCheck, Lock, CheckCircle2, FileText, ArrowLeft, Building2, UserCheck, Scale } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useLocale } from "next-intl";

export default function TermsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface" dir={isAr ? "rtl" : "ltr"}>
      <NavBar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-12 space-y-10">
        {/* Header Section */}
        <div className="space-y-4 text-center border-b border-slate-200 dark:border-slate-800 pb-8">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mb-2"
          >
            <ArrowLeft className={`w-4 h-4 ${isAr ? "rotate-180" : ""}`} /> {isAr ? "العودة للرئيسية" : "Back to Home"}
          </Link>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-extrabold mx-auto block w-fit">
            <Scale className="w-4 h-4 text-amber-500" /> {isAr ? "الحوكمة والقانون المنظم للمنصة" : "Platform Governance & Legal Code"}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {isAr ? "شروط الخدمة واتفاقية حوكمة الأدوار" : "Terms of Service & Role Governance Agreement"}
          </h1>

          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
            {isAr
              ? "القواعد الملزمة للعام الأكاديمي 2026 لأولياء الأمور، وأصحاب الحضانات والأكاديميات، والمعلمين، ومسؤولي النظام."
              : "Academic Year 2026 Binding Rules for Parents, Nursery/Academy Owners, Educators, and System Administrators."}
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <UserCheck className="w-5 h-5 text-indigo-600" />{" "}
              {isAr ? "1. حسابات المستخدمين متعددة الأدوار وعزل البيانات" : "1. Multi-Role User Accounts & Data Isolation"}
            </h2>
            <p>
              {isAr
                ? "تدعم كيدز أوايسس حسابات متعددة الأدوار لأولياء الأمور وأصحاب الأكاديميات والمعلمين ومسؤولي النظام. يكون التنقل بين الحسابات اختياريًا تمامًا عند النقر على 'إضافة حساب آخر'. يعمل المستخدمون الجدد الذين ينشئون حسابًا دون ربط في نطاق حساب فردي مستقل."
                : "Kids-Oasis supports multi-role accounts for Parents, Academy Owners, Teachers, and System Administrators. Account switching is strictly opt-in ('Add Another Account'). New users who register without explicitly linking secondary credentials operate in single, isolated account scope."}
            </p>
            <p>
              {isAr
                ? "يتم عزل كافة البيانات والملفات الشخصية للأطفال والتحليلات التجارية للأكاديميات وقوائم الفصول الدراسية وفقًا لنظام التحكم في الوصول المبني على الأدوار (RBAC) في قاعدة البيانات."
                : "Each user’s data, registered children profiles, commercial academy analytics, and classroom rosters are strictly isolated in accordance with backend MongoDB role-based access control (RBAC)."}
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Building2 className="w-5 h-5 text-indigo-600" />{" "}
              {isAr ? "2. التوثيق التجاري للأكاديمية وعقد نسبة المنصة 10%" : "2. Academy Commercial Verification & 10% Revenue Share Contract"}
            </h2>
            <p>
              {isAr
                ? "يجب على أصحاب الأكاديميات تقديم السجل التجاري والهوية الوطنية وعقد ملكية/إيجار المقر أثناء إنشاء الحساب. تظل الحسابات في حالة 'قيد مراجعة المسؤول' حتى يكتمل التدقيق."
                : "Academy Owners must submit Commercial Registration Licenses, Owner National ID proof, and Facility Lease Deeds during onboarding. Accounts remain in a Pending Admin Audit state until System Administrators complete document verification."}
            </p>
            <p>
              {isAr
                ? "عند موافقة المسؤول، تتفعل اتفاقية الشراكة الملزمة التي تنص على عمولة منصة قياسية بنسبة 10% لكل عملية دفع مصروفات دراسية. يتم تحويل صافي المصروفات (90%) إلى الحساب البنكي المسجل للأكاديمية."
                : "Upon Admin approval, a binding platform partner agreement is activated specifying a standard 10% platform commission per paid student tuition transaction. Net tuition proceeds (90%) are disbursed to the academy’s registered financial account."}
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <Lock className="w-5 h-5 text-emerald-600" />{" "}
              {isAr ? "3. حماية الطفل وخصوصية البيانات" : "3. Child Protection & FERPA/GDPR Data Privacy"}
            </h2>
            <p>
              {isAr
                ? "تطبق كيدز أوايسس أعلى معايير السرية والحماية على ملفات الأطفال والسجلات الطبية والصور. يتم التشفير الكامل ولا يُتاح الوصول إلا لأولياء الأمور المخولين وإدارات الأكاديميات المعتمدة."
                : "Kids-Oasis enforces strict confidentiality standards over child profiles, health records, vaccination histories, and photos. Child information is stored with high-level encryption and is accessible only by authorized parents and verified academy principals."}
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3 border-t border-slate-100 dark:border-slate-800 pt-6">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-5 h-5 text-amber-500" />{" "}
              {isAr ? "4. التسويات المالية وإيصالات العقد عبر Stripe" : "4. Financial Settlements, Stripe Authorization & Refunds"}
            </h2>
            <p>
              {isAr
                ? "يتم معالجة المصروفات الدراسية فورًا عبر بوابة Stripe المشفرة. وعند التسوية، يتم إصدار عقد وإيصال رسمي قابل للطباعة لولي الأمر. تخضع طلبات الاسترداد لسياسة الأكاديمية المعتمدة."
                : "All tuition payments processed via Stripe are authenticated in real time. Upon settlement, an official legal contract receipt is generated for the parent. Refund requests or program cancellations are managed according to the academy’s approved policy."}
            </p>
          </section>

        </div>
      </main>

      <Footer />
    </div>
  );
}
