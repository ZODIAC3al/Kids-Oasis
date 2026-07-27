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

// Universal CORS & OPTIONS Preflight Middleware
server.use((req: any, res: any, next: any) => {
  const requestOrigin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', requestOrigin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept, X-Api-Version',
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).send('OK');
  }
  next();
});

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
      origin: (origin, callback) => {
        callback(null, true);
      },
      credentials: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
    });
    app.use(compression());
    app.use(cookieParser());

    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    await app.init();
    isAppInitialized = true;
  }
}

export default async function handler(req: any, res: any) {
  await bootstrapServerless();
  if (req.url && !req.url.startsWith('/api')) {
    req.url = '/api' + req.url;
  }
  server(req, res);
}
