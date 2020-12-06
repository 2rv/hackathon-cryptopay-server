import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import { User } from '../core/auth/user.entity';
import { BitcoinTransaction } from '../core/bitcoin/bitcoin-transaction.entity';
import { PaymentHistory } from '../core/payment/payment-history.entity';
import { Payment } from '../core/payment/payment.entity';
import { UserBalance } from '../core/payment/user-balance/user-balance.entity';
import { Transfer } from '../core/transfer/transfer.entity';

const dbConfig = config.get('db');

export const ApiEntities = [User, BitcoinTransaction, UserBalance, Transfer, Payment, PaymentHistory,];

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: dbConfig.type,
  url: process.env.DATABASE_URL || dbConfig.url,
  entities: ApiEntities,
  ssl: true,
  logging: ['query', 'error'],
  synchronize: process.env.TYPEORM_SYNC || dbConfig.synchronize,
};
