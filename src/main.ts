import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const swagConfig = new DocumentBuilder()
    .setTitle('IndeeHub API')
    .setDescription('This is the API for the IndeeHub application')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swagConfig);

  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.enableCors();

  await app.listen(process.env.PORT || 4000);
}

bootstrap().catch(console.error);
