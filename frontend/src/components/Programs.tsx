import { getPrograms } from '@/lib/db';
import ProgramsClient from './ProgramsClient';

export default async function Programs() {
  const { title, items } = await getPrograms();
  return <ProgramsClient title={title} items={items} />;
}
