import { BitcoinTransaction } from 'apps/api/src/core/bitcoin/bitcoin-transaction.entity';

export interface BitcoinTransactionPaginationDto {
  list: BitcoinTransaction[];
  skip: number;
  take: number;
  amount: number;
}
