import { Controller, Get } from '@nestjs/common';
import { SiteService } from './site.service';

@Controller('site')
export class SiteController {
  constructor(private readonly siteService: SiteService) {}

  @Get('info')
  async getSiteInfo() {
    return this.siteService.getSiteInfo();
  }

  @Get('programs')
  async getPrograms() {
    return this.siteService.getPrograms();
  }

  @Get('news')
  async getNews() {
    return this.siteService.getNews();
  }

  @Get('testimonials')
  async getTestimonials() {
    return this.siteService.getTestimonials();
  }
}
