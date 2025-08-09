import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.setGlobalPrefix('api/v1');
  app.use(helmet());
  app.use(cookieParser());
  app.enableCors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000', credentials: true });

  const config = new DocumentBuilder()
    .setTitle('Snapzy API')
    .setDescription('REST and GraphQL endpoints')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(4000);
  // eslint-disable-next-line no-console
  console.log(`API listening on http://localhost:4000`);
}
bootstrap();