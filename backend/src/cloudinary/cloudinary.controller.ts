import { Controller, Post, UseInterceptors, UploadedFile, Body, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CloudinaryService } from './cloudinary.service';
import { UsersService } from '../users/users.service';

@ApiTags('Cloudinary Uploads')
@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload')
  @ApiOperation({ summary: 'Upload file / avatar to Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Request() req: any, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided for Cloudinary upload.');
    }
    const result: any = await this.cloudinaryService.uploadFile(file);
    const avatarUrl = result?.secure_url || result?.url;

    // Auto-update user profile picture in MongoDB
    const userId = req.user.userId || req.user._id || req.user.id;
    if (avatarUrl && userId) {
      await this.usersService.update(userId, { avatar: avatarUrl });
    }

    return {
      success: true,
      url: avatarUrl,
      public_id: result?.public_id,
    };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('upload-base64')
  @ApiOperation({ summary: 'Upload base64 image string to Cloudinary for profile picture' })
  async uploadBase64(@Request() req: any, @Body() dto: { image: string }) {
    if (!dto.image) {
      throw new BadRequestException('Base64 image string is required.');
    }
    const avatarUrl = await this.cloudinaryService.uploadImageBase64(dto.image);

    const userId = req.user.userId || req.user._id || req.user.id;
    if (avatarUrl && userId) {
      await this.usersService.update(userId, { avatar: avatarUrl });
    }

    return {
      success: true,
      url: avatarUrl,
    };
  }
}
