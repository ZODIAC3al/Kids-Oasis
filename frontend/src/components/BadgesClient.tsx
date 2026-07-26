'use client';

import { CheckCircle2, Heart, Star, type LucideIcon } from 'lucide-react';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import WaveDivider from './WaveDivider';
import { motion } from 'framer-motion';
import type { BadgeItem } from '@/lib/db';

const iconMap: Record<string, LucideIcon> = {
  check: CheckCircle2,
  heart: Heart,
  star: Star,
};

export default function BadgesClient({ items }: { items: BadgeItem[] }) {
  return (
    <section className="relative bg-sun py-16 sm:py-20">
      <WaveDivider color="#FDF6EC" flip />
      <StaggerGroup className="section-pad relative mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
        {items.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <motion.div
              key={item.title}
              variants={itemVariant}
              whileHover={{ y: -6 }}
              className="flex items-center gap-4 rounded-2xl bg-white/90 p-5 shadow-card"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun-soft text-sun-deep">
                <Icon size={22} />
              </span>
              <div>
                <h3 className="font-display font-bold text-navy">{item.title}</h3>
                <p className="text-sm text-ink/60">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </StaggerGroup>
      <WaveDivider color="#FDF6EC" />
    </section>
  );
}
