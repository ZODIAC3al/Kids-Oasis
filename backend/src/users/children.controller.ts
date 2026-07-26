import { Controller, Post, Get, Put, Body, Param, UseGuards, Req } from '@nestjs/common';
import { ChildrenService } from './children.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('children')
@UseGuards(JwtAuthGuard)
export class ChildrenController {
  constructor(private readonly childrenService: ChildrenService) {}

  @Post()
  async createChild(@Req() req, @Body() body: any) {
    return this.childrenService.create({
      ...body,
      parentId: req.user.userId,
    });
  }

  @Get()
  async getMyChildren(@Req() req) {
    return this.childrenService.findByParent(req.user.userId);
  }

  @Put(':id')
  async updateChild(@Param('id') id: string, @Body() body: any) {
    return this.childrenService.update(id, body);
  }
}
