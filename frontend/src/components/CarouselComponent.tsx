'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CarouselProps {
  imgs: string[];
  isHovered: boolean;
}

export default function CarouselComponent({ imgs, isHovered }: CarouselProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isHovered) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % imgs.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isHovered, imgs.length]);

  return (
    <div className="relative w-full h-full bg-gray-200 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.img
          key={index}
          src={imgs[index]}
          alt="nursery view"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      </AnimatePresence>
    </div>
  );
}
