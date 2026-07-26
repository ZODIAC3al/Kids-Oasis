'use client';

import { motion } from 'framer-motion';
import { Palette, PuzzleIcon, CircleDot, Languages, Cake, Apple, type LucideIcon } from 'lucide-react';
import Reveal from './motion/Reveal';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import type { OfferItem } from '@/lib/db';

const iconMap: Record<string, LucideIcon> = {
  palette: Palette,
  puzzle: PuzzleIcon,
  ball: CircleDot,
  bear: Languages,
  cake: Cake,
  apple: Apple,
};

const chipColors = ['bg-pink-soft text-pink-deep', 'bg-sky-soft text-sky-deep', 'bg-sun-soft text-sun-deep'];

export default function OfferClient({
  data,
}: {
  data: { title: string; description: string; items: OfferItem[] };
}) {
  return (
    <section className="section-pad mx-auto max-w-6xl py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
          {data.title}
        </h2>
        <p className="mt-4 text-ink/70">{data.description}</p>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => {
          const Icon = iconMap[item.icon];
          return (
            <motion.div
              key={item.title}
              variants={itemVariant}
              whileHover={{ x: 6 }}
              className="flex items-start gap-4"
            >
              <span
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${chipColors[i % 3]}`}
              >
                <Icon size={26} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-navy">{item.title}</h3>
                <p className="mt-1 text-sm text-ink/65">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
