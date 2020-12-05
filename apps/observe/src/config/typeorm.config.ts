import { ApiEntities } from 'apps/api/src/config/typeorm.config';
import * as config from 'config';
import { ConnectionOptions } from 'typeorm';

const dbConfig = config.get('db');

export const databaseOptions: ConnectionOptions = {
  type: dbConfig.type,
  url: process.env.DATABASE_URL || dbConfig.url,
  entities: ApiEntities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
