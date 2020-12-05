import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BitcoinTransaction } from 'apps/api/src/core/bitcoin/bitcoin-transaction.entity';
import { BitcoinTransactionRepository } from './bitcoin-transaction.repository';
import { BitcoinCreateTransactionDto } from './dto/bitcoin-create-transaction.dto';
import { UserBalanceService } from './user-balance.service';

@Injectable()
export class BitcoinTransactionService {
  constructor(
    @InjectRepository(BitcoinTransactionRepository)
    private bitcoinTransactionRepository: BitcoinTransactionRepository,
    private userBalanceService: UserBalanceService,
  ) {}

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

      if (dto.confirm) {
        let newBalance = Number(
          transaction.userBalance.bitcoinBalance + transaction.amount,
        );
        newBalance = Number(newBalance.toFixed());
        transaction.userBalance.bitcoinBalance = newBalance;

        await transaction.userBalance.save();
      }

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
      let newBalance = Number(
        transaction.userBalance.bitcoinBalance + transaction.amount,
      );
      newBalance = Number(newBalance.toFixed());
      transaction.userBalance.bitcoinBalance = newBalance;

      await transaction.userBalance.save();
    }

    await transaction.save();
  }
}
