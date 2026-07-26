import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SiteInfo, Program, NewsArticle, Testimonial } from './schemas/site.schema';

@Injectable()
export class SiteService {
  constructor(
    @InjectModel(SiteInfo.name) private siteInfoModel: Model<SiteInfo>,
    @InjectModel(Program.name) private programModel: Model<Program>,
    @InjectModel(NewsArticle.name) private newsModel: Model<NewsArticle>,
    @InjectModel(Testimonial.name) private testimonialModel: Model<Testimonial>,
  ) {}

  async getSiteInfo(): Promise<any> {
    const site = await this.siteInfoModel.findOne().exec();
    if (!site) {
      return {
        name: 'Kids Oasis',
        phone: '+20 123 456 7890',
        email: 'info@kidsoasis.com',
        address: 'Alexandria, Egypt',
      };
    }
    return site;
  }

  async getPrograms(): Promise<Program[]> {
    const list = await this.programModel.find().exec();
    if (!list || list.length === 0) {
      return this.programModel.insertMany([
        {
          title: 'Montessori Early Discovery',
          description: 'Child-centered experiential learning designed for ages 2–5 with sensory materials and practical life skills.',
          theme: 'pink',
          icon: 'brontosaurus',
        },
        {
          title: 'STEM & Robotics Explorers',
          description: 'Hands-on LEGO robotics, spatial logic, and introductory coding blocks tailored for young creative minds.',
          theme: 'sky',
          icon: 'trex',
        },
        {
          title: 'Trilingual Immersion & Quran',
          description: 'Comprehensive language foundation in Arabic, English, & French integrated with holy Quran recitation.',
          theme: 'sun',
          icon: 'triceratops',
        },
        {
          title: 'Creative Fine Arts & Expression',
          description: 'Guided painting, clay pottery, theatrical drama, and rhythmic musical movement for toddlers.',
          theme: 'indigo',
          icon: 'palette',
        },
      ]);
    }
    return list;
  }

  async getNews(): Promise<NewsArticle[]> {
    return this.newsModel.find().exec();
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return this.testimonialModel.find().exec();
  }
}
