import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../auth/user.entity';
import { HttpRequest } from 'libs/utils/src/http';
import { BitcoinTransaction } from '../../bitcoin/bitcoin-transaction.entity';

@Entity()
export class UserBalance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  bitcoinAddress: string;

  @Column({ type: 'float', default: 0 })
  bitcoinBalance: number;

  @OneToOne(
    type => User,
    user => user.balance,
  )
  @JoinColumn()
  user: User;

  @OneToMany(
    type => BitcoinTransaction,
    bitcoinTransaction => bitcoinTransaction.userBalance,
  )
  @JoinColumn()
  bitcoinTransaction: BitcoinTransaction[];

  @UpdateDateColumn()
  updateDate: string;

  private async getUsdBalance(): Promise<number> {
    try {
      const { data } = await HttpRequest.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`,
      );
      let resultUsd = data.price * this.bitcoinBalance;
      resultUsd = Number(resultUsd.toFixed(8));
      return resultUsd;
    } catch {
      return 0;
    }
  }

  private async getUahBalance(): Promise<number> {
    try {
      const { data } = await HttpRequest.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=BTCUAH`,
      );
      let resultUah = data.price * this.bitcoinBalance;
      resultUah = Number(resultUah.toFixed(8));
      return resultUah;
    } catch {
      return 0;
    }
  }

  async calculateUsdBalance() {
    let balance = 0;

    const bitcoinBalance = await this.getUsdBalance();

    balance += bitcoinBalance;

    balance = Number(balance.toFixed(2));

    return balance;
  }

  async calculateUahBalance() {
    let balance = 0;

    const bitcoinBalance = await this.getUahBalance();

    balance += bitcoinBalance;

    balance = Number(balance.toFixed(2));

    return balance;
  }
}
