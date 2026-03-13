import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Smart Car Marketplace API')
    .setDescription('The API documentation for the Second-Hand Car Management System')
    .setVersion('1.0')
    .addTag('cars')
    .addTag('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // This sets the URL to /api

  await app.listen(3000);
}
bootstrap();