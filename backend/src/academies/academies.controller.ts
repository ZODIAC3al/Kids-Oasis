import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { AcademiesService } from './academies.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('academies')
export class AcademiesController {
  constructor(private readonly academiesService: AcademiesService) {}

  @Get()
  async getAcademies() {
    return this.academiesService.findAllAcademies();
  }

  @Get(':id')
  async getAcademyById(@Param('id') id: string) {
    return this.academiesService.findAcademyById(id);
  }

  @Get('owner/me')
  @UseGuards(JwtAuthGuard)
  async getMyAcademies(@Req() req) {
    return this.academiesService.findAcademiesByOwner(req.user.userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createAcademy(@Body() body: any, @Req() req) {
    return this.academiesService.createAcademy({
      ...body,
      ownerId: req.user.userId,
    });
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateAcademy(@Param('id') id: string, @Body() body: any) {
    return this.academiesService.updateAcademy(id, body);
  }

  @Post('branch')
  @UseGuards(JwtAuthGuard)
  async createBranch(@Body() body: any) {
    return this.academiesService.createBranch(body);
  }

  @Post('course')
  @UseGuards(JwtAuthGuard)
  async createCourse(@Body() body: any) {
    return this.academiesService.createCourse(body);
  }

  @Get('search')
  async smartSearch(
    @Query('city') city?: string,
    @Query('governorate') governorate?: string,
    @Query('latitude') latitude?: string,
    @Query('longitude') longitude?: string,
    @Query('maxDistance') maxDistance?: string,
  ) {
    return this.academiesService.smartSearch({
      city,
      governorate,
      latitude,
      longitude,
      maxDistance: maxDistance ? parseFloat(maxDistance) : undefined,
    });
  }

  @Get('recommend')
  async getRecommendations(
    @Query('childAge') childAge: string,
    @Query('budget') budget?: string,
    @Query('preferences') preferences?: string,
  ) {
    const prefs = preferences ? preferences.split(',') : [];
    return this.academiesService.recommend(
      parseInt(childAge) || 5,
      budget ? parseFloat(budget) : undefined,
      prefs,
    );
  }

  @Patch(':id/verify')
  @UseGuards(JwtAuthGuard)
  async verifyAcademy(@Param('id') id: string, @Body('isVerified') isVerified: boolean) {
    return this.academiesService.verifyAcademy(id, isVerified);
  }

  @Post('review')
  @Post('reviews')
  @UseGuards(JwtAuthGuard)
  async addReview(@Req() req, @Body() body: any) {
    return this.academiesService.addReview(
      req.user.userId,
      body.academyId,
      body.rating,
      body.comment,
    );
  }

  @Post(':id/reviews')
  @Post(':id/review')
  @UseGuards(JwtAuthGuard)
  async addAcademyReview(@Param('id') id: string, @Req() req, @Body() body: any) {
    return this.academiesService.addReview(
      req.user.userId,
      id,
      body.rating,
      body.comment,
    );
  }
}
