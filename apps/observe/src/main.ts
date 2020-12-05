import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const serverConfig = config.get('observe');
  const port = process.env.PORT || serverConfig.PORT;

  const app = await NestFactory.create(AppModule);

  await app.listen(port);

  const logger = new Logger('Bootstrap Observe Server');
  logger.log(`Server Observe listening on port ${port}`);
}
bootstrap();
