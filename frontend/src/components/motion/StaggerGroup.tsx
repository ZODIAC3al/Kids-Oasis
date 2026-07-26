'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  stagger?: number;
  once?: boolean;
}

export const itemVariant = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function StaggerGroup({
  children,
  className,
  stagger = 0.12,
  once = true,
}: StaggerGroupProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
