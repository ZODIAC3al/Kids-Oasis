import { Controller, Post, Get, Body, BadRequestException } from '@nestjs/common';
import { NewsletterService } from './newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  async subscribe(@Body('email') email: string) {
    if (!email || !email.includes('@')) {
      throw new BadRequestException('Please provide a valid email address.');
    }
    await this.newsletterService.subscribe(email);
    return { success: true, message: "You've been successfully subscribed to Kids Oasis updates!" };
  }

  @Get()
  async getSubscribers() {
    return this.newsletterService.findAll();
  }
}
