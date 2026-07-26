import { Controller, Get, Post, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EnrollmentsService } from './enrollments.service';

@Controller('enrollments')
@UseGuards(JwtAuthGuard)
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Get()
  async getEnrollments(@Req() req) {
    const user = req.user as any;
    if (user.role === 'parent') {
      return this.enrollmentsService.findByParent(user.userId);
    }
    return this.enrollmentsService.findAll();
  }

  @Post()
  async createEnrollment(@Req() req, @Body() dto: any) {
    const userId = (req.user as any).userId;
    return this.enrollmentsService.create(userId, dto);
  }

  @Put(':id')
  async updateStatus(@Param('id') id: string, @Body() updateDto: any) {
    return this.enrollmentsService.update(id, updateDto);
  }
}
