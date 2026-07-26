"use client";

import { motion } from "framer-motion";
import { Lightbulb, Handshake, Trophy, Users, Leaf, Heart, Sparkles } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { KidsLearningAnimation } from "@/components/ui/lottie-animations";
import { useTranslations } from "next-intl";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", damping: 15, stiffness: 100 } },
};

export default function AboutUs() {
  const t = useTranslations("about");

  const coreValues = [
    { title: t("val1Title"), description: t("val1Desc"), icon: <Lightbulb className="w-6 h-6 text-primary" /> },
    { title: t("val2Title"), description: t("val2Desc"), icon: <Handshake className="w-6 h-6 text-secondary" /> },
    { title: t("val3Title"), description: t("val3Desc"), icon: <Trophy className="w-6 h-6 text-tertiary" /> },
    { title: t("val4Title"), description: t("val4Desc"), icon: <Users className="w-6 h-6 text-primary" /> },
    { title: t("val5Title"), description: t("val5Desc"), icon: <Leaf className="w-6 h-6 text-tertiary" /> },
    { title: t("val6Title"), description: t("val6Desc"), icon: <Heart className="w-6 h-6 text-error fill-current" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface transition-colors duration-300">
      <NavBar />

      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex-grow max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-16 lg:py-20"
      >
        {/* Hero Section */}
        <motion.section
          variants={containerVariants}
          className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 xl:gap-20 mb-20"
        >
          <div className="lg:w-1/2 space-y-6">
            <motion.div variants={itemVariants} className="inline-block">
              <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant bg-surface-container-lowest px-3.5 py-1.5 text-xs font-semibold text-primary shadow-elevation-1 mb-4">
                <Sparkles className="h-3.5 w-3.5" /> {t("badge")}
              </span>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-on-surface leading-tight">
                {t("titlePrefix")}<span className="text-primary">{t("titleHighlight")}</span>
              </h1>
              <div className="h-1.5 w-24 bg-primary rounded-full mt-3" />
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-4">
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {t("p1Part1")}<span className="font-semibold text-primary">Kids Oasis</span>{t("p1Part2")}
              </p>
              <p className="text-lg text-on-surface-variant leading-relaxed">
                {t("p2")}
              </p>
            </motion.div>
          </div>

          <motion.div variants={itemVariants} className="lg:w-1/2 relative w-full">
            <KidsLearningAnimation className="max-w-lg mx-auto" />
          </motion.div>
        </motion.section>

        {/* Core Values */}
        <motion.section variants={containerVariants} className="mb-20">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-on-surface mb-3">
              {t("valuesTitle")}
            </h2>
            <p className="text-base text-on-surface-variant max-w-2xl mx-auto">
              {t("valuesSubtitle")}
            </p>
          </motion.div>

          <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -6 }}
                className="card-surface p-6 flex flex-col justify-between transition hover:shadow-elevation-2"
              >
                <div>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-container-high">
                    {value.icon}
                  </div>
                  <h3 className="font-display text-xl font-bold text-on-surface mb-2">{value.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>
      </motion.main>

      <Footer />
    </div>
  );
}
