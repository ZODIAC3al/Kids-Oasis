import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child' })
  childId?: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Academy' })
  academyId?: MongooseSchema.Types.ObjectId;

  @Prop({ default: 'Pending' })
  status: string;

  @Prop({ default: 'Standard Track' })
  programName?: string;

  @Prop({ default: 1500 })
  fee?: number;

  @Prop({ default: false })
  isPaid?: boolean;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
