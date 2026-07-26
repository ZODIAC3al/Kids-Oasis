'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from './motion/Reveal';
import CountUp from './motion/CountUp';
import WaveDivider from './WaveDivider';
import type { WhyEducationContent } from '@/lib/db';

export default function WhyEducationClient({ data }: { data: WhyEducationContent }) {
  return (
    <section className="relative">
      <div className="section-pad relative mx-auto grid max-w-7xl items-center gap-14 py-16 lg:grid-cols-2">
        <Reveal direction="left" className="relative mx-auto max-w-md">
          <div className="relative aspect-[4/3] overflow-hidden rounded-squircle shadow-pop">
            <Image
              src={data.image}
              alt="Parent and two children smiling together"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
          <motion.span
            className="absolute -right-6 -top-6 text-4xl"
            animate={{ rotate: [0, 12, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
            aria-hidden
          >
            🦕
          </motion.span>
        </Reveal>

        <Reveal direction="right">
          <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
            {data.title}
          </h2>
          <p className="mt-5 max-w-lg text-ink/70">{data.description}</p>
          <a href="#programs" className="btn-pill mt-7">
            {data.cta} <span aria-hidden>→</span>
          </a>
        </Reveal>
      </div>

      {/* Stats wave band */}
      <div className="relative mt-6 overflow-hidden bg-sky py-16 sm:py-20">
        <WaveDivider color="#FDF6EC" flip className="text-cream" />
        <div className="section-pad relative mx-auto grid max-w-6xl grid-cols-2 gap-10 text-center sm:grid-cols-4">
          {data.stats.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.1}>
              <div className="font-display text-4xl font-extrabold text-white sm:text-5xl">
                <CountUp value={stat.value} />
              </div>
              <div className="mt-2 text-sm font-semibold uppercase tracking-wide text-white/85">
                {stat.label}
              </div>
            </Reveal>
          ))}
        </div>
        <WaveDivider color="#FDF6EC" className="text-cream" />
      </div>
    </section>
  );
}
