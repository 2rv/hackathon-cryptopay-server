import { Repository, EntityRepository } from 'typeorm';
import { BitcoinCreateTransactionDto } from './dto/bitcoin-create-transaction.dto';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { BitcoinTransaction } from 'apps/api/src/core/bitcoin/bitcoin-transaction.entity';
import { UserBalance } from 'apps/api/src/core/payment/user-balance/user-balance.entity';
import { BitcoinTransactionPaginationDto } from './dto/bitcoin-transaction-pagination.dto';
import { PaginationInterface } from './interface/pagination.interface';

@EntityRepository(BitcoinTransaction)
export class BitcoinTransactionRepository extends Repository<
  BitcoinTransaction
> {
  async createTransaction(createTransactionDto: BitcoinCreateTransactionDto) {
    const {
      address,
      amount,
      confirm,
      time,
      transaction,
      userBalance = null,
    } = createTransactionDto;

    const bitcoinTransaction = new BitcoinTransaction();
    bitcoinTransaction.address = address;
    bitcoinTransaction.amount = amount;
    bitcoinTransaction.confirm = confirm;
    bitcoinTransaction.transaction = transaction;
    bitcoinTransaction.transactionTime = time;
    bitcoinTransaction.userBalance = userBalance;

    try {
      await bitcoinTransaction.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException();
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async getTransactionList(
    userBalance: UserBalance,
    pagination: PaginationInterface,
  ): Promise<BitcoinTransactionPaginationDto> {
    const { skip, take } = pagination;

    const query = this.createQueryBuilder('bitcoin_transaction');

    query.where('bitcoin_transaction.userBalance = :id', {
      id: userBalance.id,
    });

    const amount = await query.getCount();

    if (skip) {
      query.offset(Number(skip));
    }

    if (take) {
      query.limit(Number(take));
    }

    query.select([
      'bitcoin_transaction.id',
      'bitcoin_transaction.amount',
      'bitcoin_transaction.createDate',
      'bitcoin_transaction.confirm',
      'bitcoin_transaction.transaction',
    ]);

    const list = await query.getMany();

    return {
      list,
      take,
      skip,
      amount,
    };
  }
}
