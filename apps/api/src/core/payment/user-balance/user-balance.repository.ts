import { Repository, EntityRepository } from 'typeorm';
import { User } from '../../auth/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Errors } from '../enum/errors.enum';
import { UserBalance } from './user-balance.entity';

@EntityRepository(UserBalance)
export class UserBalanceRepository extends Repository<UserBalance> {
  async createUserBalance(user: User) {
    const balance = new UserBalance();

    balance.user = user;

    try {
      await balance.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(Errors.USER_BALANCE_ALREADY_EXISTS);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
