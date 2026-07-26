import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ChildrenService } from './children.service';

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private childrenService: ChildrenService) {}

  @Get()
  async getMyChildren(@Req() req) {
    const userId = (req.user as any).userId;
    const userRole = (req.user as any).role;
    if (userRole === 'admin' || userRole === 'academyOwner' || userRole === 'nurseryOwner' || userRole === 'teacher' || userRole === 'serviceprovider') {
      return this.childrenService.findAll();
    }
    const children = await this.childrenService.findByParent(userId);
    if (!children || children.length === 0) {
      return this.childrenService.findAll();
    }
    return children;
  }

  @Post()
  async createChild(@Req() req, @Body() childDto: any) {
    const userId = (req.user as any).userId;
    return this.childrenService.create(userId, childDto);
  }

  @Put(':id')
  async updateChild(@Req() req, @Param('id') id: string, @Body() updateDto: any) {
    const userId = (req.user as any).userId;
    return this.childrenService.update(id, userId, updateDto);
  }

  @Delete(':id')
  async deleteChild(@Req() req, @Param('id') id: string) {
    const userId = (req.user as any).userId;
    return this.childrenService.delete(id, userId);
  }

  @Get(':id/recommendations')
  async getRecommendationsForChild(@Param('id') id: string) {
    // Return sample AI recommendations for child
    return [
      {
        name: 'Bright Minds Early Learning',
        address: 'Smouha, Alexandria',
        branches: [{ programs: [{ price: 1500 }] }]
      },
      {
        name: 'Creative Minds Studio',
        address: 'Kafr El Dawwar, Alexandria',
        branches: [{ programs: [{ price: 1800 }] }]
      }
    ];
  }
}
