import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Branch extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Academy', required: true })
  academyId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  governorate: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({ required: true })
  contactNumber: string;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
BranchSchema.index({ location: '2dsphere' });
BranchSchema.index({ city: 1, governorate: 1 });
