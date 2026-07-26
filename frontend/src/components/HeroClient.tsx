'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { HeroContent } from '@/lib/db';

export default function HeroClient({ hero }: { hero: HeroContent }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-b from-cream-dark to-cream pb-24 pt-10 sm:pb-32"
    >
      {/* decorative doodles */}
      <motion.span
        className="absolute left-6 top-24 text-3xl text-sky-deep/70 sm:left-14"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        aria-hidden
      >
        ★
      </motion.span>
      <motion.span
        className="absolute right-10 top-16 text-4xl text-sun-deep/70"
        animate={{ rotate: [0, 15, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        aria-hidden
      >
        ✦
      </motion.span>
      <motion.div
        className="absolute -left-10 top-1/2 h-40 w-40 rounded-full bg-sky-soft/60 blur-2xl"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
        aria-hidden
      />

      <div className="section-pad relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="eyebrow-pill"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-6 font-display text-5xl font-extrabold leading-tight text-navy sm:text-6xl lg:text-7xl"
          >
            {hero.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-6 max-w-md text-lg text-ink/70"
          >
            {hero.description}
          </motion.p>

          <motion.a
            href="#programs"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="btn-pill mt-8"
          >
            {hero.cta} <span aria-hidden>→</span>
          </motion.a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto max-w-md"
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-squircle shadow-pop">
            <Image
              src={hero.image}
              alt="Child drawing and learning at LittleDino"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
              priority
            />
          </div>
          <motion.div
            className="absolute -bottom-6 -left-6 flex h-20 w-20 items-center justify-center rounded-full bg-sun text-3xl shadow-pop"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
          >
            🚀
          </motion.div>
          <motion.div
            className="absolute -right-4 top-8 flex h-14 w-14 items-center justify-center rounded-full bg-pink text-2xl shadow-pop"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            🚲
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
