import { UserBalance } from '../../payment/user-balance/user-balance.entity';

export interface BitcoinCreateTransactionDto {
  address: string;
  amount: number;
  confirmations?: number;
  confirm?: boolean;
  time: number;
  transaction: string;
  userBalance?: UserBalance;
}
