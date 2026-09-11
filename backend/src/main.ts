import { appMetadata } from './app-metadata';
import { requestLogging } from './common/logging/request-logging';
import { StructuredLogger } from './common/logging/structured-logger';
import { PublicErrorFilter } from './common/logging/public-error.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { getCorsOrigins } from './config/cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new StructuredLogger(),
  });
  const configService = app.get(ConfigService);

  app.use(requestLogging);
  app.enableShutdownHooks();
  app.useGlobalFilters(new PublicErrorFilter());
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );
  app.enableCors({
    origin: getCorsOrigins(configService),
    credentials: true,
    exposedHeaders: ['X-Request-ID'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  await app.listen(process.env.PORT ?? 3000);
  new StructuredLogger().log({ event: 'app_started', ...appMetadata });
}
bootstrap();
