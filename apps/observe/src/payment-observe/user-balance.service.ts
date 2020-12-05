import { Injectable } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { UserBalance } from 'apps/api/src/core/payment/user-balance/user-balance.entity';
import { UserBalanceRepository } from './user-balance.repository';

@Injectable()
export class UserBalanceService {
  constructor(
    @InjectRepository(UserBalanceRepository)
    private userBalanceRepository: UserBalanceRepository,
  ) {}

  async getAccountBalanceByAddress(
    bitcoinAddress: string,
  ): Promise<UserBalance> {
    const balance = await this.userBalanceRepository.findOne({
      where: { bitcoinAddress },
    });

    return balance;
  }
}
