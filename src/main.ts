import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { get } from 'config';

import { AppModule } from './app.module';

async function bootstrap() {
  const { port } = get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  await app.listen(port);
  logger.log(`Application listening on port: ${port}`);
}
bootstrap();
