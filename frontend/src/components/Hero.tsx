import { getHeroContent } from '@/lib/db';
import HeroClient from './HeroClient';

export default async function Hero() {
  const hero = await getHeroContent();
  return <HeroClient hero={hero} />;
}
