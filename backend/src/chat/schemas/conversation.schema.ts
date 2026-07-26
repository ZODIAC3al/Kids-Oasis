import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
  @Prop([{ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true }])
  participants: MongooseSchema.Types.ObjectId[];

  @Prop({ default: Date.now })
  lastMessageAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
