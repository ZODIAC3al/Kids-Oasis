import { getNews } from '@/lib/db';
import LatestNewsClient from './LatestNewsClient';

export default async function LatestNews() {
  const data = await getNews();
  return <LatestNewsClient data={data} />;
}
