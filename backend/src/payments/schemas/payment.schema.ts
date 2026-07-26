import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Academy', required: true })
  academyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Enrollment' })
  enrollmentId?: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({ default: 'egp' })
  currency: string;

  @Prop({ required: true })
  stripePaymentIntentId: string;

  @Prop({ default: 'succeeded' })
  status: string;

  @Prop({ default: 'card' })
  paymentMethod: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
