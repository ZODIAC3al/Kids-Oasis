"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, CheckCircle2, ShieldCheck, MapPin, Heart } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import apiClient from "@/lib/axios";
import { toast } from "react-toastify";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 400 : -400,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 400 : -400,
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" },
  }),
};

export default function BookingStepper() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const locale = useLocale();
  const router = useRouter();

  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("prog1");
  const [selectedBranch, setSelectedBranch] = useState("br1");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadChildren() {
      try {
        const res = await apiClient.get("/children");
        setChildren(res.data || []);
        if (res.data?.[0]?._id) {
          setSelectedChild(res.data[0]._id);
        }
      } catch (err) {
        console.error("Failed to load children for booking:", err);
      }
    }
    loadChildren();
  }, []);

  const programs = [
    { id: "prog1", name: "Montessori Early Years", age: "Age 2-4", fee: "1,500 EGP / month" },
    { id: "prog2", name: "STEM & Robotics Basic", age: "Age 4-6", fee: "1,800 EGP / month" },
  ];

  const branches = [
    { id: "br1", name: "Smouha Branch", address: "5 El-Khateeb, Alexandria" },
    { id: "br2", name: "Khaled Ibn El-Waleed Branch", address: "Bitos, Alexandria" },
  ];

  const timeSlots = ["09:00 AM - 11:00 AM", "11:00 AM - 01:00 PM", "02:00 PM - 04:00 PM"];

  const handleNext = async () => {
    if (step === 3) {
      setSubmitting(true);
      try {
        await apiClient.post("/bookings", {
          childId: selectedChild || undefined,
          programId: selectedProgram,
          branchId: selectedBranch,
          date: selectedDate || new Date().toISOString(),
          timeSlot: selectedTimeSlot,
        });
        toast.success("Visit booking registered successfully!");
        setDirection(1);
        setStep(4);
      } catch (err) {
        console.error("Failed to post booking:", err);
        toast.error("Failed to register visit booking.");
      } finally {
        setSubmitting(false);
      }
    } else if (step < 4) {
      setDirection(1);
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection(-1);
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    if (step === 1) return selectedProgram !== "";
    if (step === 2) return selectedBranch !== "";
    if (step === 3) return selectedDate !== "" && selectedTimeSlot !== "";
    return true;
  };

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface">
      <NavBar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between mb-8 px-4">
          {["Program", "Branch", "Schedule", "Confirm"].map((label, index) => {
            const stepNum = index + 1;
            const isCompleted = step > stepNum;
            const isActive = step === stepNum;
            return (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCompleted
                      ? "bg-tertiary text-on-tertiary"
                      : isActive
                      ? "bg-primary text-on-primary shadow-elevation-1"
                      : "bg-surface-container-high text-on-surface-variant"
                  }`}
                >
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stepNum}
                </div>
                <span
                  className={`text-xs font-bold hidden sm:block ${
                    isActive || isCompleted ? "text-on-surface" : "text-on-surface-variant/60"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Stepper Card */}
        <div className="card-surface p-6 sm:p-8 shadow-elevation-2 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="space-y-6 flex-grow"
            >
              {/* STEP 1: Select Child & Program */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-on-surface">Choose Child & Program</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Select which of your children this visit booking is for, and pick a program.</p>
                  </div>

                  {children.length > 0 && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">
                        Select Child Profile
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {children.map((c) => {
                          const isSel = selectedChild === c._id;
                          return (
                            <button
                              key={c._id}
                              type="button"
                              onClick={() => setSelectedChild(c._id)}
                              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                                isSel
                                  ? "bg-primary text-on-primary border-primary shadow-elevation-1"
                                  : "bg-surface-container-low text-on-surface border-outline-variant hover:bg-surface-container"
                              }`}
                            >
                              <Heart className="w-3.5 h-3.5" />
                              {c.name}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {programs.map((prog) => {
                      const isSelected = selectedProgram === prog.id;
                      return (
                        <div
                          key={prog.id}
                          onClick={() => setSelectedProgram(prog.id)}
                          className={`p-4 rounded-[var(--radius-control)] border transition cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? "border-primary bg-primary-container/10 text-on-surface"
                              : "border-outline-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-on-surface">{prog.name}</h3>
                            <span className="text-xs text-on-surface-variant">{prog.age}</span>
                          </div>
                          <span className="text-xs font-bold text-primary">{prog.fee}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Select Branch */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-on-surface">Select Branch</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Select the academy branch closest to your location.</p>
                  </div>

                  <div className="space-y-3">
                    {branches.map((branch) => {
                      const isSelected = selectedBranch === branch.id;
                      return (
                        <div
                          key={branch.id}
                          onClick={() => setSelectedBranch(branch.id)}
                          className={`p-4 rounded-[var(--radius-control)] border transition cursor-pointer flex justify-between items-center ${
                            isSelected
                              ? "border-secondary bg-secondary-container/15 text-on-surface"
                              : "border-outline-variant hover:bg-surface-container-low"
                          }`}
                        >
                          <div className="space-y-1">
                            <h3 className="text-sm font-bold text-on-surface">{branch.name}</h3>
                            <p className="text-xs text-on-surface-variant flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-primary" /> {branch.address}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Select Schedule */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-bold font-display text-on-surface">Choose Date & Time</h2>
                    <p className="text-xs text-on-surface-variant mt-1">Pick a convenient calendar date and daily time slot.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                        Calendar Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-[var(--radius-control)] border border-outline-variant bg-surface-container-lowest text-sm text-on-surface focus-visible:outline-2 focus-visible:outline-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">
                        Available Slots
                      </label>
                      <div className="space-y-2">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot;
                          return (
                            <button
                              key={slot}
                              onClick={() => setSelectedTimeSlot(slot)}
                              className={`w-full text-left px-4 py-2.5 rounded-[var(--radius-control)] text-xs font-bold border transition ${
                                isSelected
                                  ? "bg-tertiary text-on-tertiary border-tertiary"
                                  : "bg-surface-container-lowest text-on-surface-variant border-outline-variant hover:bg-surface-container-low"
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Confirmation */}
              {step === 4 && (
                <div className="space-y-6 text-center py-6">
                  <div className="w-16 h-16 bg-tertiary-container/20 text-tertiary rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-bold font-display text-on-surface">Visit Booking Confirmed!</h2>
                  <p className="text-sm text-on-surface-variant max-w-sm mx-auto">
                    We have registered your slot reservation. Confirmation details were dispatched.
                  </p>

                  <div className="bg-surface-container-low rounded-[var(--radius-control)] p-4 max-w-md mx-auto text-left border border-outline-variant space-y-2 text-xs text-on-surface-variant">
                    <p className="flex justify-between">
                      <span className="font-semibold">Selected Program:</span>
                      <span className="font-bold text-on-surface">
                        {programs.find((p) => p.id === selectedProgram)?.name}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold">Branch Location:</span>
                      <span className="font-bold text-on-surface">
                        {branches.find((b) => b.id === selectedBranch)?.name}
                      </span>
                    </p>
                    <p className="flex justify-between">
                      <span className="font-semibold">Schedule Date & Time:</span>
                      <span className="font-bold text-on-surface">
                        {selectedDate} • {selectedTimeSlot}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Stepper Navigation Buttons */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-outline-variant">
            {step < 4 ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBack}
                  disabled={step === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
                <Button
                  size="sm"
                  onClick={handleNext}
                  disabled={!isStepValid()}
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <div className="flex w-full gap-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1 justify-center">
                  Book Another Visit
                </Button>
                <Button onClick={() => router.push(`/${locale}/dashboard/parent`)} className="flex-1 justify-center">
                  Go to My Dashboard
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
