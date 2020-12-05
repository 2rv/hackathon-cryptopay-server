import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../../auth/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { UserBalanceRepository } from './user-balance.repository';
import { UserBalanceDto } from '../dto/user-balance.dto';
import { UserBalance } from './user-balance.entity';
import { CurrencyType } from 'apps/api/src/enums/currency.enum';
import { Errors } from '../enum/errors.enum';

@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(UserBalanceRepository)
    private userBalanceRepository: UserBalanceRepository,
  ) {}

  async createUserBalance(user: User): Promise<void> {
    return this.userBalanceRepository.createUserBalance(user);
  }

  async getAccountBalance(user: User): Promise<UserBalanceDto> {
    const balance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    return {
      bitcoinBalance: balance.bitcoinBalance,
      usdBalance: await balance.getUsdBalance(),
    };
  }

  async getAccountBalanceByAddress(
    bitcoinAddress: string,
  ): Promise<UserBalance> {
    const balance = await this.userBalanceRepository.findOne({
      where: { bitcoinAddress },
    });

    return balance;
  }

  async declineUserBalance(
    user: User,
    currency: CurrencyType,
    amount: number,
  ): Promise<void> {
    const balance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    if (currency === CurrencyType.BTC) {
      let result = balance.bitcoinBalance - amount;

      if (result < 0) {
        throw new BadRequestException(Errors.USER_BALANCE_INSUFFICIENT_AMOUNT);
      }
      result = Number(result.toFixed(8));
      balance.bitcoinBalance = result;
    }

    await balance.save();
  }

  async increaseUserBalance(
    user: User,
    currency: CurrencyType,
    amount: number,
  ): Promise<void> {
    const balance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    if (currency === CurrencyType.BTC) {
      let result = balance.bitcoinBalance - amount;
      result = Number(result.toFixed(8));
      balance.bitcoinBalance = result;
    }

    await balance.save();
  }
}
