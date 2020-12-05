import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { UserBalance } from '../payment/user-balance/user-balance.entity';

@Entity()
@Unique(['transaction'])
export class BitcoinTransaction extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  address: string;

  @Column()
  transaction: string;

  @Column({ type: 'bigint' })
  transactionTime: number;

  @Column({ default: false })
  confirm: boolean;

  @Column({ type: 'float' })
  amount: number;

  @ManyToOne(
    type => UserBalance,
    balance => balance.bitcoinTransaction,
    { nullable: true },
  )
  userBalance: UserBalance;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
