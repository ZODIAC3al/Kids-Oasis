import { getCTA } from '@/lib/db';
import CTAClient from './CTAClient';

export default async function CTA() {
  const data = await getCTA();
  return <CTAClient data={data} />;
}
