'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram, type LucideIcon } from 'lucide-react';
import Reveal from './motion/Reveal';
import type { FooterContent, SiteInfo } from '@/lib/db';

const socialIcons: Record<string, LucideIcon> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  pinterest: Instagram,
};

export default function FooterClient({
  footer,
  site,
}: {
  footer: FooterContent;
  site: SiteInfo;
}) {
  return (
    <footer className="relative overflow-hidden bg-navy pt-20 text-white">
      <motion.span
        className="absolute right-10 top-10 text-3xl opacity-40"
        animate={{ rotate: [0, 15, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        aria-hidden
      >
        ✦
      </motion.span>

      <div className="section-pad mx-auto grid max-w-7xl gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-sky text-lg">
              🦖
            </span>
            <span className="font-display text-lg font-extrabold">
              Kids<span className="text-sky">Oasis</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-white/60">{footer.about}</p>
        </Reveal>

        <Reveal delay={0.1}>
          <h4 className="font-display font-bold text-sun">Our Contacts</h4>
          <ul className="mt-4 space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-sky" /> {site.address}
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-sky" /> {site.phone}
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-sky" /> {site.email}
            </li>
          </ul>
        </Reveal>

        <Reveal delay={0.2}>
          <h4 className="font-display font-bold text-sun">Our Gallery</h4>
          <div className="mt-4 grid grid-cols-4 gap-2">
            {footer.gallery.map((src) => (
              <div key={src} className="relative aspect-square overflow-hidden rounded-lg">
                <Image
                  src={src}
                  alt="LittleDino gallery thumbnail"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <h4 className="font-display font-bold text-sun">Open Hours</h4>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {footer.hours.map((h) => (
              <li key={h.day} className="flex justify-between gap-4">
                <span>{h.day}</span>
                <span className="font-semibold text-white">{h.time}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <div className="section-pad mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 py-6 text-xs text-white/50 sm:flex-row">
        <p>
          Copyright &copy; {new Date().getFullYear()} {site.name}. All Rights Reserved.
        </p>
        <div className="flex gap-3">
          {footer.social.map((key) => {
            const Icon = socialIcons[key];
            return (
              <motion.a
                key={key}
                href="#"
                whileHover={{ y: -3, scale: 1.1 }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-sky"
                aria-label={key}
              >
                <Icon size={16} />
              </motion.a>
            );
          })}
        </div>
      </div>
    </footer>
  );
}
