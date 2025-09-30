import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import {
  API_SYSTEM_DESCRIPTION,
  API_SYSTEM_NAME,
} from './common/constants';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ThrottlerExceptionFilter } from './common/filters';
var Fingerprint = require('express-fingerprint');
import { LoggerConfig } from './config/logger.config';
import { ConfigService } from '@nestjs/config';

const API_SYSTEM_PORT = process.env.API_SYSTEM_PORT;
const API_SYSTEM_VERSION = process.env.API_SYSTEM_VERSION;
const CONSOLE_URL = process.env.CONSOLE_URL;

async function bootstrap() {
  // Create the app with bufferLogs option to queue logs until Winston is ready
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // Get ConfigService after app is created
  const configService = app.get(ConfigService);

  // Set up Winston logger
  const winstonLogger = LoggerConfig.createWinstonLogger(configService);
  app.useLogger(winstonLogger);

  app.use(cookieParser());

  app.use(
    Fingerprint({
      parameters: [Fingerprint.useragent],
    }),
  );

  // Configure CORS
  app.enableCors({
    origin: CONSOLE_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  app.useGlobalFilters(new ThrottlerExceptionFilter());

  // Configure global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Config swagger
  const config = new DocumentBuilder()
    .setTitle(API_SYSTEM_NAME)
    .setDescription(API_SYSTEM_DESCRIPTION)
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'token',
    )
    .addSecurityRequirements('token')
    .setVersion(API_SYSTEM_VERSION!)
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(API_SYSTEM_PORT!);

  // Use the Winston logger instance directly
  winstonLogger.log(`Application is running on port ${API_SYSTEM_PORT}`, 'Bootstrap');
  winstonLogger.log(`Swagger docs available at: http://localhost:${API_SYSTEM_PORT}/api/docs`, 'Bootstrap');
}
bootstrap();
