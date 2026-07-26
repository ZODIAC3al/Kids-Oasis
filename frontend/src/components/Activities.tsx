import { getActivities } from '@/lib/db';
import ActivitiesClient from './ActivitiesClient';

export default async function Activities() {
  const data = await getActivities();
  return <ActivitiesClient data={data} />;
}
