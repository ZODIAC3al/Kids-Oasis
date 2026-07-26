'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from './motion/Reveal';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import type { TestimonialItem } from '@/lib/db';

const cardThemes = [
  { bg: 'bg-pink', text: 'text-white' },
  { bg: 'bg-sky', text: 'text-white' },
  { bg: 'bg-sun', text: 'text-navy' },
];

export default function TestimonialsClient({
  data,
}: {
  data: { title: string; description: string; items: TestimonialItem[] };
}) {
  return (
    <section className="section-pad mx-auto max-w-6xl py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
          {data.title}
        </h2>
        <p className="mt-4 text-ink/70">{data.description}</p>
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item, i) => {
          const theme = cardThemes[i % 3];
          return (
            <motion.div
              key={item.name}
              variants={itemVariant}
              whileHover={{ y: -8 }}
              className="flex flex-col"
            >
              <div className={`relative rounded-3xl ${theme.bg} p-6 shadow-card`}>
                <p className={`text-sm leading-relaxed ${theme.text} opacity-95`}>
                  &ldquo;{item.quote}&rdquo;
                </p>
                <span
                  className={`absolute -bottom-3 left-10 h-6 w-6 rotate-45 ${theme.bg}`}
                  aria-hidden
                />
              </div>
              <div className="mt-8 flex items-center gap-3 pl-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-4 ring-white shadow-card">
                  <Image
                    src={item.avatar}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-navy">{item.name}</div>
                  <div className="text-xs text-ink/55">{item.role}</div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
