import { getBadges } from '@/lib/db';
import BadgesClient from './BadgesClient';

export default async function Badges() {
  const items = await getBadges();
  return <BadgesClient items={items} />;
}
