import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, type OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { DEFAULT_APP_PORT } from './app.config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './errorHandler/filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new GlobalExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('NestJS Recruitment Task')
    .setDescription('API documentation for the NestJS Recruitment Task')
    .setVersion('1.0')
    .build();
  const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? DEFAULT_APP_PORT);
}

bootstrap();
