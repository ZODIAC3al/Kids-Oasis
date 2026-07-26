import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SiteInfo extends Document {
  @Prop({ required: true, default: 'Kids Oasis' })
  name: string;

  @Prop({ default: '+20 123 456 7890' })
  phone: string;

  @Prop({ default: 'info@kidsoasis.com' })
  email: string;

  @Prop({ default: 'Alexandria, Egypt' })
  address: string;

  @Prop({ type: Object })
  hero: Record<string, any>;

  @Prop({ type: Object })
  whyEducation: Record<string, any>;

  @Prop({ type: Object })
  offer: Record<string, any>;

  @Prop({ type: Object })
  gallery: Record<string, any>;

  @Prop({ type: Array })
  badges: any[];

  @Prop({ type: Object })
  activities: Record<string, any>;

  @Prop({ type: Object })
  cta: Record<string, any>;

  @Prop({ type: Object })
  footer: Record<string, any>;
}

export const SiteInfoSchema = SchemaFactory.createForClass(SiteInfo);

@Schema({ timestamps: true })
export class Program extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ default: 'primary' })
  theme: string;

  @Prop()
  icon: string;
}

export const ProgramSchema = SchemaFactory.createForClass(Program);

@Schema({ timestamps: true })
export class NewsArticle extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  date: string;

  @Prop({ required: true })
  author: string;

  @Prop({ required: true })
  category: string;

  @Prop()
  image: string;

  @Prop()
  content: string;
}

export const NewsArticleSchema = SchemaFactory.createForClass(NewsArticle);

@Schema({ timestamps: true })
export class Testimonial extends Document {
  @Prop({ required: true })
  quote: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  avatar: string;

  @Prop({ default: 5 })
  rating: number;
}

export const TestimonialSchema = SchemaFactory.createForClass(Testimonial);
