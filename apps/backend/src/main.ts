import './patch-send';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    rawBody: true, // required for future Stripe webhook signature verification
  });

  // CORS: open in dev, restricted to storefront domain in production
  const allowedOrigins =
    process.env.NODE_ENV === 'production'
      ? [process.env.STOREFRONT_URL || 'http://localhost:3000']
      : true;

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix
  const globalPrefix = process.env.API_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Static uploads directory
  const uploadsPath = path.join(process.cwd(), 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('KINETIC // TECH E-Commerce API')
    .setDescription(
      'High-performance REST API with atomic transactional orders, RBAC authentication, 3D assets & CEO telemetry. Rate-limited.',
    )
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'KINETIC API Docs // Swagger',
    customCss: `
      .swagger-ui .topbar { background-color: #0d0d0d; border-bottom: 1px solid #262626; }
      body { background-color: #0a0a0a; color: #e5e5e5; }
      .swagger-ui .info .title { color: #ffffff; font-family: monospace; }
    `,
  });

  const port = process.env.PORT || 4000;
  await app.listen(port);

  logger.log(`⚡ API Gateway running on: http://localhost:${port}/${globalPrefix}`);
  logger.log(`📚 Interactive Swagger Docs on: http://localhost:${port}/api/docs`);
  logger.log(
    `🔒 CORS mode: ${process.env.NODE_ENV === 'production' ? JSON.stringify(allowedOrigins) : 'open (dev)'}`,
  );
}

bootstrap();
