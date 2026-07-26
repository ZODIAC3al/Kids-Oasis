import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import {
  SiteInfo,
  SiteInfoSchema,
  Program,
  ProgramSchema,
  NewsArticle,
  NewsArticleSchema,
  Testimonial,
  TestimonialSchema,
} from './schemas/site.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SiteInfo.name, schema: SiteInfoSchema },
      { name: Program.name, schema: ProgramSchema },
      { name: NewsArticle.name, schema: NewsArticleSchema },
      { name: Testimonial.name, schema: TestimonialSchema },
    ]),
  ],
  controllers: [SiteController],
  providers: [SiteService],
  exports: [SiteService],
})
export class SiteModule {}
