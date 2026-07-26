"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  User,
  ShieldCheck,
  CreditCard,
  Sparkles,
  BookOpen,
} from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function EnrollmentFlowPage() {
  const [step, setStep] = useState(1);

  // Form State
  const [program, setProgram] = useState("Montessori Early Years");
  const [studentName, setStudentName] = useState("Emma Thompson");
  const [birthday, setBirthday] = useState("2020-05-12");
  const [gender, setGender] = useState("female");
  const [guardianName, setGuardianName] = useState("Amira Hassan");
  const [guardianEmail, setGuardianEmail] = useState("parent@kidsoasis.com");
  const [guardianPhone, setGuardianPhone] = useState("+20 123 456 7890");

  const steps = [
    "Program",
    "Student",
    "Guardian",
    "Review & Pay",
    "Success",
  ];

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Step Stepper Header */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((label, idx) => {
            const num = idx + 1;
            const isCompleted = step > num;
            const isActive = step === num;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                    isCompleted
                      ? "bg-tertiary text-on-tertiary"
                      : isActive
                      ? "bg-primary text-on-primary shadow-elevation-1"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : num}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    isActive || isCompleted ? "text-on-surface" : "text-on-surface-variant/60"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stepper Card Body */}
        <div className="card-surface p-6 sm:p-8 shadow-elevation-2 min-h-[420px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-on-surface">Select Program</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Choose the educational pathway for your child</p>
                </div>

                <div className="space-y-3">
                  {[
                    { name: "Montessori Early Years", age: "Age 2-4", fee: "$1,200 / mo" },
                    { name: "ABC & Literacy Program", age: "Age 3-5", fee: "$1,100 / mo" },
                    { name: "First Steps 4K Prep", age: "Age 4-6", fee: "$1,350 / mo" },
                  ].map((prog) => (
                    <div
                      key={prog.name}
                      onClick={() => setProgram(prog.name)}
                      className={`p-4 rounded-[var(--radius-control)] border transition cursor-pointer flex justify-between items-center ${
                        program === prog.name
                          ? "border-primary bg-primary-container/10 text-on-surface font-semibold"
                          : "border-outline-variant hover:bg-surface-container-low"
                      }`}
                    >
                      <div>
                        <h3 className="text-sm font-bold text-on-surface">{prog.name}</h3>
                        <span className="text-xs text-on-surface-variant">{prog.age}</span>
                      </div>
                      <span className="text-xs font-bold text-primary">{prog.fee}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-on-surface">Student Details</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Enter your child's information for enrollment registration</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Full Child Name
                    </label>
                    <Input value={studentName} onChange={(e) => setStudentName(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                        Birth Date
                      </label>
                      <Input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                        Gender
                      </label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="h-11 w-full rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest px-3.5 text-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-on-surface">Guardian Contact</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Parent or legal guardian contact info</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                      Guardian Name
                    </label>
                    <Input value={guardianName} onChange={(e) => setGuardianName(e.target.value)} />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                        Email Address
                      </label>
                      <Input type="email" value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">
                        Phone Number
                      </label>
                      <Input type="tel" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div>
                  <h2 className="font-display text-2xl font-bold text-on-surface">Review & Payment</h2>
                  <p className="text-xs text-on-surface-variant mt-1">Confirm application details before submitting</p>
                </div>

                <div className="rounded-[var(--radius-card)] bg-surface-container-low p-4 border border-outline-variant space-y-2 text-xs text-on-surface-variant">
                  <p className="flex justify-between"><span className="font-semibold">Selected Program:</span><span className="font-bold text-on-surface">{program}</span></p>
                  <p className="flex justify-between"><span className="font-semibold">Student:</span><span className="font-bold text-on-surface">{studentName} ({birthday})</span></p>
                  <p className="flex justify-between"><span className="font-semibold">Guardian:</span><span className="font-bold text-on-surface">{guardianName} ({guardianPhone})</span></p>
                </div>

                <div className="p-4 rounded-[var(--radius-card)] border border-primary/30 bg-primary-container/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    <span className="text-xs font-bold text-on-surface">Registration Deposit</span>
                  </div>
                  <span className="font-display text-lg font-bold text-primary">$150.00</span>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="5" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tertiary-container/20 text-tertiary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h2 className="font-display text-3xl font-bold text-on-surface">Enrollment Application Submitted!</h2>
                <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                  Your application for <strong className="text-on-surface">{studentName}</strong> has been transmitted to the academy. Track approval status in your Dashboard.
                </p>
                <div className="pt-4">
                  <Button href="/dashboard/parent">Go to Parent Dashboard</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Stepper Buttons */}
          {step < 5 && (
            <div className="flex justify-between items-center pt-6 border-t border-outline-variant mt-8">
              <Button variant="outline" size="sm" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Back
              </Button>

              <Button size="sm" onClick={() => setStep((s) => Math.min(5, s + 1))}>
                {step === 4 ? "Submit Application" : "Continue"} <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
