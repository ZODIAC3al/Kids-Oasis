import { getOffer } from '@/lib/db';
import OfferClient from './OfferClient';

export default async function Offer() {
  const data = await getOffer();
  return <OfferClient data={data} />;
}
