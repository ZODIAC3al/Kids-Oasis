import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';

const server = express();

export const createNestServer = async (expressInstance: express.Express) => {
  const app = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressInstance),
    { bodyParser: false },
  );

  // Custom 50mb body limit for Cloudinary photo uploads
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Security Headers
  app.use(helmet({ contentSecurityPolicy: false }));

  // CORS Origin Configuration for Vercel
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(',')
      : true,
    credentials: true,
  });

  app.use(compression());
  app.use(cookieParser());
  app.setGlobalPrefix(process.env.API_PREFIX || 'api');

  await app.init();
  return app;
};

createNestServer(server);

export default server;
