/**
 * lib/db.ts
 * ---------------------------------------------------------------------------
 * Data-access layer. Every page/component pulls its content through the
 * functions below instead of hard-coding copy — nothing is inlined in JSX.
 *
 * Right now each function reads from `data/db.json` (a stand-in seed
 * database) through an artificial async delay so the rest of the app
 * already behaves as if it were awaiting a network round trip.
 *
 * Swapping in a real database later means touching ONLY this file:
 *   - Prisma:   const rows = await prisma.program.findMany()
 *   - MongoDB:  const rows = await db.collection('programs').find().toArray()
 *   - REST/API: const rows = await fetch(`${API_URL}/programs`).then(r => r.json())
 * Every consumer (`components/*.tsx`) keeps working unchanged because they
 * only depend on the TypeScript types exported here, not on JSON specifics.
 * ---------------------------------------------------------------------------
 */
import raw from '@/data/db.json';

// Simulates real network/query latency so loading states are meaningful.
const simulateLatency = <T,>(payload: T, ms = 0): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(payload), ms));

// ---- Types -----------------------------------------------------------------
export interface SiteInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
}
export interface NavLink {
  label: string;
  href: string;
}
export interface HeroContent {
  eyebrow: string;
  title: string;
  description: string;
  cta: string;
  image: string;
}
export interface ProgramItem {
  id: string;
  title: string;
  description: string;
  theme: 'pink' | 'sky' | 'sun';
  icon: string;
}
export interface StatItem {
  label: string;
  value: number;
}
export interface WhyEducationContent {
  title: string;
  description: string;
  cta: string;
  image: string;
  stats: StatItem[];
}
export interface OfferItem {
  title: string;
  description: string;
  icon: string;
}
export interface GalleryContent {
  title: string;
  cta: string;
  images: string[];
}
export interface BadgeItem {
  title: string;
  description: string;
  icon: string;
}
export interface ActivitiesContent {
  title: string;
  description: string;
  items: string[];
  image: string;
}
export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}
export interface CTAContent {
  title: string;
  phone: string;
  button: string;
}
export interface NewsPost {
  id: string;
  title: string;
  date: string;
  author: string;
  category: string;
  image: string;
}
export interface FooterContent {
  about: string;
  gallery: string[];
  hours: { day: string; time: string }[];
  social: string[];
}

const database = raw as {
  site: SiteInfo;
  nav: { links: NavLink[] };
  hero: HeroContent;
  programs: { title: string; items: ProgramItem[] };
  whyEducation: WhyEducationContent;
  offer: { title: string; description: string; items: OfferItem[] };
  gallery: GalleryContent;
  badges: BadgeItem[];
  activities: ActivitiesContent;
  testimonials: { title: string; description: string; items: TestimonialItem[] };
  cta: CTAContent;
  news: { title: string; cta: string; posts: NewsPost[] };
  footer: FooterContent;
};

// ---- Query functions ---------------------------------------------------
export const getSiteInfo = () => simulateLatency(database.site);
export const getNavLinks = () => simulateLatency(database.nav.links);
export const getHeroContent = () => simulateLatency(database.hero);
export const getPrograms = () => simulateLatency(database.programs);
export const getWhyEducation = () => simulateLatency(database.whyEducation);
export const getOffer = () => simulateLatency(database.offer);
export const getGallery = () => simulateLatency(database.gallery);
export const getBadges = () => simulateLatency(database.badges);
export const getActivities = () => simulateLatency(database.activities);
export const getTestimonials = () => simulateLatency(database.testimonials);
export const getCTA = () => simulateLatency(database.cta);
export const getNews = () => simulateLatency(database.news);
export const getFooter = () => simulateLatency(database.footer);
