import * as config from 'config';
import { UserEntity } from '../core/user/user.entity';
import { ConnectionOptions } from 'typeorm';
import { ApiEntities } from 'apps/api/src/config/typeorm.config';

const dbConfig = config.get('db');

const Entities = [UserEntity, ...ApiEntities];

export const databaseOptions: ConnectionOptions = {
  type: dbConfig.type,
  url: process.env.DATABASE_URL || dbConfig.url,
  entities: Entities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.SYNCHRONIZE,
};
