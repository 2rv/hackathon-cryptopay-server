import { Injectable, Logger } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { BitcoinApi } from 'libs/bitcoin-api/src';
import { BitcoinApiConfig } from '../config/bitcoin.config';
import { BitcoinTransactionService } from './bitcoin-transaction.service';
import { BitcoinCreateTransactionDto } from './dto/bitcoin-create-transaction.dto';
import { Intervales } from './enum/intervales.enum';
import { LastTransaction } from './last-transaction.enity';

@Injectable()
export class PaymentObserveService {
  private bitcoinApi: BitcoinApi;
  private logger = new Logger('PaymentObserveService');

  constructor(private bitcoinTransactionService: BitcoinTransactionService) {
    this.bitcoinApi = new BitcoinApi(BitcoinApiConfig, Logger);
  }

  @Interval(Intervales.NEW_TRANSACTIONS)
  async observeNewBitcoinTransactions() {
    this.logger.log('Starting observe new bitcoin transaction');
    const transactions = await this.bitcoinApi.getListTransactions();

    for (const trans of transactions) {
      const { address, category, amount, confirmations, time, txid } = trans;

      if (category !== 'receive') {
        return null;
      }

      const latestTransaction = await LastTransaction.getOne({ id: txid });

      if (latestTransaction) {
        return null;
      }

      this.logger.log(`New uncached transaction: ${txid}`);

      const lastTransaction = new LastTransaction(txid, address);
      lastTransaction.save();

      const createTransactionDto: BitcoinCreateTransactionDto = {
        address,
        amount,
        confirmations,
        time,
        transaction: txid,
      };

      this.bitcoinTransactionService.createTransaction(createTransactionDto);
    }
  }

  @Interval(Intervales.CONFIRM_TRANSACTIONS)
  async observeBitcoinTransaction(): Promise<void> {
    this.logger.log('Starting observe confirmed transaction');
    const transactions = await this.bitcoinTransactionService.getUnconfirmedTransaction();

    if (transactions.length !== 0) {
      for (const trans of transactions) {
        const transactionInfo = await this.bitcoinApi.getTransaction(
          trans.transaction,
        );
        if (transactionInfo.confirmations > 0) {
          this.logger.log(`New confirmed transaction: ${trans.transaction}`);
          this.bitcoinTransactionService.confirmTransaction(trans);
        }
      }
    }
  }
}
