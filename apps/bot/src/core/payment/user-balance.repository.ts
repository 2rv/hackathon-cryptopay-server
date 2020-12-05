import { UserBalanceEntity } from './user-balance.entity';
import { UserEntity } from '../user/user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Errors } from './enum/errors.enum';
import { getRepository } from 'typeorm';

export class UserBalanceRepository {
  async createUserBalance(user: UserEntity) {
    const balance = new UserBalanceEntity();

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

  async getUserBalance(user: UserEntity) {
    return getRepository(UserBalanceEntity).findOne({
      where: { user },
    });
  }
}
