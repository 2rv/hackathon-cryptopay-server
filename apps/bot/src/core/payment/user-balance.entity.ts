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
import { UserEntity } from '../user/user.entity';
import { HttpRequest } from 'libs/utils/src/http';

@Entity({ name: 'user_balance' })
export class UserBalanceEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, default: null })
  bitcoinAddress: string;

  @Column({ type: 'float', default: 0 })
  bitcoinBalance: number;

  @OneToOne(
    type => UserEntity,
    user => user.balance,
  )
  @JoinColumn()
  user: UserEntity;

  @UpdateDateColumn()
  updateDate: string;

  private async getBitcoinBalance(): Promise<number> {
    try {
      const { data } = await HttpRequest.get(
        `https://api.binance.com/api/v3/ticker/price?symbol=BTCRUB`,
      );
      let resultRub = data.price * this.bitcoinBalance;
      resultRub = Number(resultRub.toFixed(8));
      return resultRub;
    } catch {
      return 0;
    }
  }

  async getTotalBalance() {
    let balance = 0;

    const bitcoinBalance = await this.getBitcoinBalance();

    balance += bitcoinBalance;

    balance = Number(balance.toFixed(2));

    return balance;
  }
}
