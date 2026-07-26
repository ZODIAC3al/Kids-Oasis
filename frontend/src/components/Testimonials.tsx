import { getTestimonials } from '@/lib/db';
import TestimonialsClient from './TestimonialsClient';

export default async function Testimonials() {
  const data = await getTestimonials();
  return <TestimonialsClient data={data} />;
}
