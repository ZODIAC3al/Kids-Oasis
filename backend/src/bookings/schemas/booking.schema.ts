import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  RESCHEDULED = 'rescheduled',
  CANCELLED = 'cancelled'
}

@Schema({ timestamps: true })
export class Booking extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Mixed })
  childId?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  academyId?: any;

  @Prop({ type: MongooseSchema.Types.Mixed })
  programId?: any;

  @Prop()
  branchId?: string;

  @Prop()
  date?: Date;

  @Prop()
  timeSlot?: string;

  @Prop({ type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING })
  status: BookingStatus;

  @Prop()
  notes?: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
