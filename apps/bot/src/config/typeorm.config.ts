import * as config from 'config';
import { UserEntity } from '../core/user/user.entity';
import { ConnectionOptions } from 'typeorm';
import { UserBalanceEntity } from '../core/payment/user-balance.entity';

const dbConfig = config.get('DB');

export const Entities = [UserEntity, UserBalanceEntity];

export const databaseOptions: ConnectionOptions = {
  type: dbConfig.type,
  url: process.env.DATABASE_URL || dbConfig.url,
  entities: Entities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.SYNCHRONIZE,
};
