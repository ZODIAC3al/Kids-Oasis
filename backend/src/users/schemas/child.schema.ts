import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Child extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  birthday: Date;

  @Prop({ required: true })
  gender: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  parentId: Types.ObjectId;

  @Prop()
  photoUrl?: string;

  @Prop()
  allergies?: string;

  @Prop()
  medicalNotes?: string;

  @Prop({ type: [String], default: [] })
  interests: string[];

  @Prop({ type: [String], default: [] })
  vaccinationRecords: string[];
}

export const ChildSchema = SchemaFactory.createForClass(Child);
