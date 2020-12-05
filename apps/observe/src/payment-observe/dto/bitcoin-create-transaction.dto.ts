import { UserBalance } from 'apps/api/src/core/payment/user-balance/user-balance.entity';
export interface BitcoinCreateTransactionDto {
  address: string;
  amount: number;
  confirmations?: number;
  confirm?: boolean;
  time: number;
  transaction: string;
  userBalance?: UserBalance;
}
