'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import Reveal from './motion/Reveal';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import type { ActivitiesContent } from '@/lib/db';

const blockColors = ['bg-pink', 'bg-sky', 'bg-sun', 'bg-mint'];
const letters = ['D', 'i', 'n', 'o'];

export default function ActivitiesClient({ data }: { data: ActivitiesContent }) {
  return (
    <section className="relative overflow-hidden bg-cream py-20 sm:py-28">
      <div className="section-pad relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <Reveal direction="left">
          <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">{data.title}</h2>
          <p className="mt-5 max-w-md text-ink/70">{data.description}</p>

          <StaggerGroup className="mt-8 space-y-3">
            {data.items.map((item) => (
              <motion.div key={item} variants={itemVariant} className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-soft text-sky-deep">
                  <PawPrint size={16} />
                </span>
                <span className="font-display font-semibold text-navy">{item}</span>
              </motion.div>
            ))}
          </StaggerGroup>

          <div className="mt-10 flex gap-3">
            {letters.map((letter, i) => (
              <motion.div
                key={letter + i}
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${blockColors[i]} font-display text-2xl font-extrabold text-navy shadow-pop sm:h-16 sm:w-16 sm:text-3xl`}
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                {letter}
              </motion.div>
            ))}
          </div>
        </Reveal>

        <Reveal direction="right" className="relative mx-auto max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden rounded-squircle shadow-pop">
            <Image
              src={data.image}
              alt="Smiling child at LittleDino"
              fill
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
