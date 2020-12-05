import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BitcoinTransactionRepository } from './bitcoin-transaction.repository';
import { UserBalance } from '../payment/user-balance/user-balance.entity';
import { BitcoinTransactionPaginationDto } from './dto/bitcoin-transaction-pagination.dto';
import { BitcoinCreateTransactionDto } from './dto/bitcoin-create-transaction.dto';
import { UserBalanceService } from '../payment/user-balance/user-balance.service';
import { BitcoinTransaction } from './bitcoin-transaction.entity';
import { PaginationInterface } from '../../interfaces/pagination.interface';

@Injectable()
export class BitcoinTransactionService {
  constructor(
    @InjectRepository(BitcoinTransactionRepository)
    private bitcoinTransactionRepository: BitcoinTransactionRepository,
    private userBalanceService: UserBalanceService,
  ) {}

  async getTransactionList(
    userBalance: UserBalance,
    pagination: PaginationInterface,
  ): Promise<BitcoinTransactionPaginationDto> {
    return this.bitcoinTransactionRepository.getTransactionList(
      userBalance,
      pagination,
    );
  }

  async createTransaction(dto: BitcoinCreateTransactionDto): Promise<void> {
    const transaction = await this.bitcoinTransactionRepository.findOne({
      where: { transaction: dto.transaction },
    });

    if (!transaction) {
      dto.confirm = dto.confirmations > 0;
      dto.time = dto.time * 1000;

      const userBalance = await this.userBalanceService.getAccountBalanceByAddress(
        dto.address,
      );

      if (userBalance) {
        dto.userBalance = userBalance;
      }

      await this.bitcoinTransactionRepository.createTransaction(dto);
    }
  }

  async getUnconfirmedTransaction(): Promise<BitcoinTransaction[]> {
    return this.bitcoinTransactionRepository.find({
      where: { confirm: false },
      relations: ['userBalance'],
    });
  }

  async confirmTransaction(transaction: BitcoinTransaction): Promise<void> {
    transaction.confirm = true;

    if (transaction.userBalance) {
      transaction.userBalance.bitcoinBalance += transaction.amount;
      await transaction.userBalance.save();
    }

    await transaction.save();
  }
}
