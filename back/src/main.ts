import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilitar CORS para el frontend
  app.enableCors({
    origin: 'http://localhost:5173', // Puerto de Vite por defecto
    credentials: true,
  });
  
  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3000);
  console.log('Backend running on http://localhost:3000');
}
bootstrap();