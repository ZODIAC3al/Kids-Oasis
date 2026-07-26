import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'kids_oasis',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      );

      upload.write(file.buffer);
      upload.end();
    });
  }

  async uploadImageBase64(base64Str: string): Promise<string> {
    try {
      const res = await cloudinary.uploader.upload(base64Str, {
        folder: 'kids_oasis_avatars',
      });
      return res.secure_url;
    } catch (err: any) {
      console.warn('Cloudinary avatar upload info:', err?.message || err);
      return base64Str;
    }
  }
}
