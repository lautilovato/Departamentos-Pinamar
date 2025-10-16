import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para frontend en Vercel y desarrollo local
  const FRONTEND_URL = process.env.FRONTEND_URL;
  const allowedOrigins = [FRONTEND_URL, 'http://localhost:5173'].filter(Boolean) as string[];

  app.enableCors({
    origin: (origin, callback) => {
      // Permitir herramientas sin origin (curl, Postman)
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedOrigins.includes(origin) ||
        /\.vercel\.app$/.test(new URL(origin).hostname) ||
        /localhost(:\d+)?$/.test(new URL(origin).host);

      if (isAllowed) return callback(null, true);
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  });

  // Habilitar validación global
  app.useGlobalPipes(new ValidationPipe());

  const port = parseInt(process.env.PORT || '3000', 10);
  await app.listen(port, '0.0.0.0');
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();