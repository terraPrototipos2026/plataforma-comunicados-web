import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import express from 'express';
import { join } from 'node:path';
import * as fs from 'node:fs';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  app.use('/uploads', express.static(uploadsDir));

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173',
    credentials: true,
  });

  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('TERRA — Plataforma de Comunicados Internos API')
    .setDescription(
      'Documentación oficial OpenAPI 3.0 para la Plataforma Corporativa de Comunicados de Terra Colchones & Muebles: Autenticación (JWT + Refresh Cookie Rotation), Roles, Permisos y Departamentos.',
    )
    .setVersion('1.0.0')
    .addTag('Estado del Sistema', 'Verificación de disponibilidad del servicio')
    .addTag('Autenticación', 'Registro, inicio de sesión, rotación de tokens y perfil de usuario')
    .addTag('Departamentos', 'Gestión del catálogo de departamentos corporativos')
    .addTag('Permisos', 'Gestión del catálogo de permisos granulares del sistema')
    .addTag('Roles', 'Gestión de roles organizacionales y asignación en rol_permiso')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Introduce el token de acceso JWT (Access Token de 15 minutos)',
        in: 'header',
      },
      'JWT-auth',
    )
    .addCookieAuth(
      'refresh_token',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'refresh_token',
        description: 'Cookie HttpOnly que almacena el Refresh Token opaco (7 días)',
      },
      'refresh_token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'TERRA — API de Comunicados Internos',
    jsonDocumentUrl: 'api/docs-json',
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 Swagger disponible en: http://localhost:${port}/api/docs`);
}
await bootstrap();
