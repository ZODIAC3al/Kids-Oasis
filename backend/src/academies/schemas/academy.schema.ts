import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ collection: 'academies', timestamps: true })
export class Academy extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  logo: string;

  @Prop({ default: 0, index: true })
  rating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ required: true })
  curriculum: string;

  @Prop([String])
  languages: string[];

  @Prop([String])
  activities: string[];

  @Prop({ required: true })
  minAgeAllowed: number;

  @Prop({ required: true })
  maxAgeAllowed: number;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: [
      {
        userName: { type: String, required: true },
        userAvatar: { type: String },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  reviews: Array<{
    userName: string;
    userAvatar?: string;
    rating: number;
    comment: string;
    createdAt?: Date;
  }>;
}

export const AcademySchema = SchemaFactory.createForClass(Academy);
AcademySchema.index({ name: 'text', description: 'text' });
