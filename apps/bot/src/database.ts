import { databaseOptions } from './config/typeorm.config';
import { createConnection } from 'typeorm';
import { Logger } from '@nestjs/common';

export const initDatabaseConnection = async () => {
  await createConnection(databaseOptions)
    .then(() => Logger.log('Started Database Server'))
    .catch(err => {
      Logger.error(err);
    });
};
