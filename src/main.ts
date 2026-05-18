import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // Health check excluded so Render can reach /health without the versioned prefix
  app.setGlobalPrefix('api/v1', { exclude: ['health'] });

  const rawOrigins = config.get<string>('ALLOWED_ORIGINS', '');
  app.enableCors({
    origin: rawOrigins ? rawOrigins.split(',').map((o) => o.trim()) : true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // Automatically exclude @Exclude() fields (e.g. User.password) on all responses
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Weight Tracker API')
    .setDescription('REST API for tracking body weight and fitness progress')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, swaggerConfig));

  const port = config.get<number>('PORT', 3000);
  await app.listen(port);

  console.log(`API running   → http://localhost:${port}/api/v1`);
  console.log(`Swagger docs  → http://localhost:${port}/api/docs`);
}

bootstrap();
