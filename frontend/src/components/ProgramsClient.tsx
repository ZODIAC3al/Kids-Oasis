'use client';

import { motion } from 'framer-motion';
import Reveal from './motion/Reveal';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import { Brontosaurus, TRex, Triceratops } from './icons/Dinos';
import type { ProgramItem } from '@/lib/db';

const themeStyles: Record<string, { bg: string; text: string }> = {
  pink: { bg: 'bg-pink', text: 'text-white' },
  sky: { bg: 'bg-sky', text: 'text-white' },
  sun: { bg: 'bg-sun', text: 'text-navy' },
};

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  brontosaurus: Brontosaurus,
  trex: TRex,
  triceratops: Triceratops,
};

export default function ProgramsClient({
  title,
  items,
}: {
  title: string;
  items: ProgramItem[];
}) {
  return (
    <section id="programs" className="section-pad relative mx-auto max-w-7xl py-24">
      <Reveal className="text-center">
        <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">{title}</h2>
        <div className="mx-auto mt-3 h-1.5 w-20 rounded-full bg-sun" />
      </Reveal>

      <StaggerGroup className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const style = themeStyles[item.theme];
          const Icon = icons[item.icon];
          return (
            <motion.div
              key={item.id}
              variants={itemVariant}
              whileHover={{ y: -10, rotate: -1 }}
              transition={{ type: 'spring', stiffness: 220, damping: 16 }}
              className={`group relative overflow-hidden rounded-squircle ${style.bg} p-8 shadow-card`}
            >
              <Icon
                className={`h-24 w-24 ${style.text} opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
              />
              <h3 className={`mt-6 font-display text-2xl font-extrabold ${style.text}`}>
                {item.title}
              </h3>
              <p className={`mt-2 text-sm leading-relaxed ${style.text} opacity-90`}>
                {item.description}
              </p>
              <a
                href="#"
                className={`mt-5 inline-flex items-center gap-2 font-display text-sm font-bold underline-offset-4 ${style.text} hover:underline`}
              >
                Read More <span aria-hidden>→</span>
              </a>
            </motion.div>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
