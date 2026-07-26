'use client';

import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import Reveal from './motion/Reveal';
import WaveDivider from './WaveDivider';
import type { CTAContent } from '@/lib/db';

export default function CTAClient({ data }: { data: CTAContent }) {
  return (
    <section id="contact" className="relative overflow-hidden bg-pink py-20 text-center text-white sm:py-24">
      <WaveDivider color="#FDF6EC" flip />
      <motion.span
        className="absolute left-10 top-10 text-3xl opacity-70"
        animate={{ x: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        aria-hidden
      >
        ✈️
      </motion.span>

      <Reveal className="section-pad relative mx-auto max-w-3xl">
        <h2 className="font-display text-2xl font-extrabold sm:text-3xl">{data.title}</h2>
        <div className="mt-3 font-display text-4xl font-extrabold tracking-wide sm:text-5xl">
          {data.phone}
        </div>
        <a
          href={`tel:${data.phone.replace(/\s/g, '')}`}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 font-display font-bold text-pink-deep shadow-pop transition-transform hover:-translate-y-1"
        >
          <Phone size={18} /> {data.button}
        </a>
      </Reveal>

      <WaveDivider color="#FDF6EC" />
    </section>
  );
}
