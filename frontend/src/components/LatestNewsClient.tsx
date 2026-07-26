'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import Reveal from './motion/Reveal';
import StaggerGroup, { itemVariant } from './motion/StaggerGroup';
import type { NewsPost } from '@/lib/db';

export default function LatestNewsClient({
  data,
}: {
  data: { title: string; cta: string; posts: NewsPost[] };
}) {
  return (
    <section id="news" className="section-pad mx-auto max-w-6xl py-24">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
          {data.title}
        </h2>
        <a href="#" className="btn-pill">
          {data.cta}
        </a>
      </Reveal>

      <StaggerGroup className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data.posts.map((post) => (
          <motion.article
            key={post.id}
            variants={itemVariant}
            whileHover={{ y: -8 }}
            className="overflow-hidden rounded-3xl bg-white shadow-card"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 90vw, 30vw"
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-sun px-3 py-1 text-xs font-bold uppercase text-navy shadow-sm">
                {post.category}
              </span>
            </div>
            <div className="p-6">
              <div className="text-xs font-semibold uppercase tracking-wide text-ink/50">
                {post.date} &middot; {post.author}
              </div>
              <h3 className="mt-3 font-display text-lg font-bold leading-snug text-navy">
                {post.title}
              </h3>
              <a
                href="#"
                className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-sky-deep hover:underline"
              >
                Read More <span aria-hidden>→</span>
              </a>
            </div>
          </motion.article>
        ))}
      </StaggerGroup>
    </section>
  );
}
