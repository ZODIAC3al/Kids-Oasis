'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from './motion/Reveal';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import type { GalleryContent } from '@/lib/db';

export default function GalleryClient({ data }: { data: GalleryContent }) {
  return (
    <section id="gallery" className="section-pad relative mx-auto max-w-6xl py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
          {data.title}
        </h2>
        <a href="#" className="btn-pill">
          {data.cta}
        </a>
      </Reveal>

      <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5">
        {data.images.map((src, i) => {
          const isAccent = !src;
          return (
            <motion.div
              key={src || `accent-${i}`}
              variants={itemVariant}
              whileHover={{ scale: 1.04 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="relative aspect-square overflow-hidden rounded-3xl shadow-card"
            >
              {isAccent ? (
                <div className="flex h-full w-full items-center justify-center bg-pink">
                  <motion.span
                    className="text-5xl"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🦖
                  </motion.span>
                </div>
              ) : (
                <Image
                  src={src}
                  alt="LittleDino students playing and learning"
                  fill
                  sizes="(max-width: 768px) 45vw, 30vw"
                  className="object-cover transition-transform duration-500 hover:scale-110"
                />
              )}
            </motion.div>
          );
        })}
      </StaggerGroup>
    </section>
  );
}
