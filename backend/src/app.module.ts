import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AcademiesModule } from './academies/academies.module';
import { BookingsModule } from './bookings/bookings.module';
import { ChatModule } from './chat/chat.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { SiteModule } from './site/site.module';
import { ChildrenModule } from './children/children.module';
import { EnrollmentsModule } from './enrollments/enrollments.module';
import { PaymentsModule } from './payments/payments.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { BullModule } from '@nestjs/bull';

const imports: any[] = [
  // Configurations
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: ['.env'],
  }),

  // MongoDB connection with serverSelectionTimeoutMS for serverless safety
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI') || 'mongodb://localhost:27017/kids-oasis',
      serverSelectionTimeoutMS: 5000,
    }),
    inject: [ConfigService],
  }),

  // Feature Modules
  AuthModule,
  UsersModule,
  ChildrenModule,
  EnrollmentsModule,
  PaymentsModule,
  AcademiesModule,
  BookingsModule,
  ChatModule,
  CloudinaryModule,
  SiteModule,
  NewsletterModule,
];

// Only enable BullModule background queue if REDIS_HOST is explicitly configured and not on Vercel
if (process.env.REDIS_HOST && !process.env.VERCEL) {
  imports.push(
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT') || 6379,
        },
      }),
      inject: [ConfigService],
    }),
  );
}

@Module({
  imports,
})
export class AppModule {}
