import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from '../user/user.entity';

import { UserBalanceRepository } from './user-balance.repository';
import { UserBalanceDto } from './dto/user-balance.dto';
import { UserBalanceEntity } from './user-balance.entity';
import { CurrencyType } from './enum/currency.enum';
import { Errors } from './enum/errors.enum';
import { getRepository } from 'typeorm';

export class UserBalanceService {
  userBalanceRepository: UserBalanceRepository;
  constructor() {
    this.userBalanceRepository = new UserBalanceRepository();
  }

  async createUserBalance(user: UserEntity): Promise<void> {
    return this.userBalanceRepository.createUserBalance(user);
  }

  async getAccountBalance(user: UserEntity): Promise<UserBalanceDto> {
    const balance = await this.userBalanceRepository.getUserBalance(user);

    return {
      bitcoinBalance: balance.bitcoinBalance,
      totalBalance: await balance.getTotalBalance(),
    };
  }

  async declineUserBalance(
    user: UserEntity,
    currency: CurrencyType,
    amount: number,
  ): Promise<void> {
    const balance = await this.userBalanceRepository.getUserBalance(user);

    if (currency === CurrencyType.BTC) {
      let result = balance.bitcoinBalance - amount;

      if (result < 0) {
        throw new BadRequestException({
          error: Errors.USER_BALANCE_INSUFFICIENT_AMOUNT,
          balance: await balance.getTotalBalance(),
        });
      }
      result = Number(result.toFixed(8));
      balance.bitcoinBalance = result;
    }

    await balance.save();
  }

  async increaseUserBalance(
    user: UserEntity,
    currency: CurrencyType,
    amount: number,
  ): Promise<void> {
    const balance = await this.userBalanceRepository.getUserBalance(user);

    if (currency === CurrencyType.BTC) {
      let result = balance.bitcoinBalance - amount;
      result = Number(result.toFixed(8));
      balance.bitcoinBalance = result;
    }

    await balance.save();
  }
}
