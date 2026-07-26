import { getGallery } from '@/lib/db';
import GalleryClient from './GalleryClient';

export default async function Gallery() {
  const data = await getGallery();
  return <GalleryClient data={data} />;
}
