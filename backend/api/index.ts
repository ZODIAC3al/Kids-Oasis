import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const express = require('express');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const helmet = require('helmet');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const compression = require('compression');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieParser = require('cookie-parser');

const server = express();
let isAppInitialized = false;

async function bootstrapServerless() {
  if (!isAppInitialized) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { bodyParser: false },
    );

    app.use(express.json({ limit: '50mb' }));
    app.use(express.urlencoded({ limit: '50mb', extended: true }));
    app.use(helmet({ contentSecurityPolicy: false }));
    app.enableCors({
      origin: true,
      credentials: true,
    });
    app.use(compression());
    app.use(cookieParser());

    app.setGlobalPrefix(process.env.API_PREFIX || 'api');
    app.enableVersioning({
      type: VersioningType.URI,
    });

    await app.init();
    isAppInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await bootstrapServerless();
  server(req, res);
}
