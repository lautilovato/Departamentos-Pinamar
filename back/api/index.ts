import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';

const server = express();

export default async (req: any, res: any) => {
  if (!server.locals.nest) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
      { logger: false }
    );
    
    // Enable CORS
    app.enableCors({
      origin: true,
      credentials: true,
    });
    
    await app.init();
    server.locals.nest = true;
  }
  
  return server(req, res);
};