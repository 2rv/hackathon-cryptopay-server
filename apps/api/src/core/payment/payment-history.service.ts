import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { User } from '../auth/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BitcoinTransactionService } from '../bitcoin/bitcoin-transaction.service';
import { BitcoinTransactionPaginationDto } from '../bitcoin/dto/bitcoin-transaction-pagination.dto';
import { PaginationInterface } from '../../interfaces/pagination.interface';
import { UserBalanceRepository } from './user-balance/user-balance.repository';

@Injectable()
export class PaymentHistoryService {
  constructor(
    @InjectRepository(UserBalanceRepository)
    private userBalanceRepository: UserBalanceRepository,
    private bitcoinTransactionService: BitcoinTransactionService,
  ) {}

  async getBitcoinPaymentHistoryList(
    user: User,
    skip: number,
    take: number,
  ): Promise<BitcoinTransactionPaginationDto> {
    const balance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    const pagination: PaginationInterface = {
      skip: skip || 0,
      take: take || 15,
    };

    return this.bitcoinTransactionService.getTransactionList(
      balance,
      pagination,
    );
  }
}
