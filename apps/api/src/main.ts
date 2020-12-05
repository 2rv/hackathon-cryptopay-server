import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as config from 'config';

export async function bootstrap() {
  const serverConfig = config.get('api');
  const port = process.env.PORT || serverConfig.port;

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use(helmet());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(port);

  const logger = new Logger('Bootstrap Api Server');
  logger.log(`Api Server listening on port ${port}`);
  logger.log(`Api Server URL is http://localhost:${port}`);
}
bootstrap();
