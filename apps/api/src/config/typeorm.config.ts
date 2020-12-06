import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from 'apps/bot/src/core/user/user.entity';
import * as config from 'config';
import { User } from '../core/auth/user.entity';
import { BitcoinTransaction } from '../core/bitcoin/bitcoin-transaction.entity';
import { UserBalance } from '../core/payment/user-balance/user-balance.entity';

const dbConfig = config.get('db');

export const ApiEntities = [User, BitcoinTransaction, UserBalance, UserEntity];

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  url: process.env.DATABASE_URL || dbConfig.url,
  entities: ApiEntities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
