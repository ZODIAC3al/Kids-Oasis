import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NewsletterSubscriber } from './schemas/newsletter.schema';

@Injectable()
export class NewsletterService {
  constructor(
    @InjectModel(NewsletterSubscriber.name)
    private subscriberModel: Model<NewsletterSubscriber>,
  ) {}

  async subscribe(email: string): Promise<NewsletterSubscriber> {
    const cleanEmail = email.trim().toLowerCase();
    const existing = await this.subscriberModel.findOne({ email: cleanEmail }).exec();
    if (existing) {
      if (!existing.isActive) {
        existing.isActive = true;
        return existing.save();
      }
      return existing;
    }
    const newSub = new this.subscriberModel({ email: cleanEmail });
    return newSub.save();
  }

  async findAll(): Promise<NewsletterSubscriber[]> {
    return this.subscriberModel.find().exec();
  }
}
