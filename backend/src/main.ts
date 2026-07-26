import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Custom high-capacity Express body parser for large base64 image uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Security Headers via Helmet
  app.use(helmet());

  // Enable CORS
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : true,
    credentials: true,
  });

  // Compression
  app.use(compression());

  // Parsers
  app.use(cookieParser());

  // Rate Limiting
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: process.env.NODE_ENV === 'production' ? 100 : 5000,
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // Global Prefix & Versioning
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: process.env.API_VERSION || '1',
  });

  // Global Validation Pipes (DTO Transformer and Validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Kids-Oasis Enterprise API')
    .setDescription('The Kids-Oasis nursery management platform core API endpoints description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`Kids-Oasis backend server running on http://localhost:${port}`);
}
bootstrap();
