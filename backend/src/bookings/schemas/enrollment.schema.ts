import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export enum EnrollmentStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  INTERVIEW = 'interview',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  ENROLLED = 'enrolled'
}

@Schema({ timestamps: true })
export class Enrollment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  parentId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Child', required: true })
  childId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Academy', required: true })
  academyId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Program', required: true })
  programId: MongooseSchema.Types.ObjectId;

  @Prop({
    type: {
      birthCertificate: String,
      childPhoto: String,
      parentIdDoc: String,
      vaccinationRecord: String,
      medicalReport: String
    },
    required: true
  })
  documents: {
    birthCertificate: string;
    childPhoto: string;
    parentIdDoc: string;
    vaccinationRecord: string;
    medicalReport: string;
  };

  @Prop({ type: String, enum: Object.values(EnrollmentStatus), default: EnrollmentStatus.PENDING })
  status: EnrollmentStatus;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment);
