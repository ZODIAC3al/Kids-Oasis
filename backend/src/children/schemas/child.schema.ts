import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Child extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop()
  birthday?: Date;

  @Prop({ enum: ['male', 'female'], default: 'male' })
  gender: string;

  @Prop()
  allergies?: string;

  @Prop()
  medicalNotes?: string;

  @Prop({ type: [String], default: [] })
  interests?: string[];

  @Prop({ type: [String], default: [] })
  vaccinationRecords?: string[];

  @Prop({ default: 'https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=400&auto=format&fit=crop' })
  avatar?: string;
}

export const ChildSchema = SchemaFactory.createForClass(Child);
