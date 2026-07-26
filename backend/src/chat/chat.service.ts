import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from './schemas/message.schema';
import { Conversation } from './schemas/conversation.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<Message>,
    @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
  ) {}

  async createConversation(participants: string[]): Promise<Conversation> {
    const existing = await this.conversationModel.findOne({
      participants: { $all: participants }
    }).exec();

    if (existing) return existing;

    const conversation = new this.conversationModel({ participants });
    return conversation.save();
  }

  async findConversations(userId: string): Promise<Conversation[]> {
    return this.conversationModel.find({ participants: userId }).exec();
  }

  async saveMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    const message = new this.messageModel({ conversationId, senderId, text });
    await message.save();

    await this.conversationModel.findByIdAndUpdate(conversationId, {
      lastMessageAt: new Date()
    });

    return message;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    return this.messageModel.find({ conversationId }).sort({ createdAt: 1 }).exec();
  }
}
