import { BitcoinTransaction } from '../bitcoin-transaction.entity';

export interface BitcoinTransactionPaginationDto {
  list: BitcoinTransaction[];
  skip: number;
  take: number;
  amount: number;
}
