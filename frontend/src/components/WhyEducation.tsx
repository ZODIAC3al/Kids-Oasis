import { getWhyEducation } from '@/lib/db';
import WhyEducationClient from './WhyEducationClient';

export default async function WhyEducation() {
  const data = await getWhyEducation();
  return <WhyEducationClient data={data} />;
}
