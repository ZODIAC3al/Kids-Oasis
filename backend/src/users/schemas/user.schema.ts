import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  GUEST = 'guest',
  PARENT = 'parent',
  TEACHER = 'teacher',
  ACADEMY_OWNER = 'nurseryOwner',
  ACADEMY_STAFF = 'academyStaff',
  SUPPORT = 'support',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
  SERVICE_PROVIDER = 'serviceProvider' // legacy alias
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true })
  firstName: string;

  @Prop({ required: true, trim: true })
  lastName: string;

  @Prop({ required: true, unique: true, index: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, enum: Object.values(UserRole), default: UserRole.PARENT })
  role: UserRole;

  @Prop({ required: true, enum: ['male', 'female'], default: 'female' })
  gender: string;

  @Prop({ default: '+201000000000' })
  phoneNumber: string;

  @Prop({ default: 'Alexandria, Egypt' })
  address: string;

  @Prop({ default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop' })
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: true })
  isVerified: boolean;

  @Prop()
  verificationToken?: string;

  @Prop()
  passwordResetToken?: string;

  @Prop()
  passwordResetExpires?: Date;

  @Prop({ default: 0 })
  failedLoginAttempts: number;

  @Prop()
  lockUntil?: Date;

  @Prop([String])
  refreshTokens: string[];

  @Prop({ type: Object })
  googleProfile?: {
    id: string;
    email: string;
    name: string;
    picture: string;
  };

  @Prop({ default: false })
  isMfaEnabled: boolean;

  @Prop()
  mfaSecret?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 });
