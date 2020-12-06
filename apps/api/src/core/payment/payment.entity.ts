import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  PrimaryColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { PaymentHistory } from './payment-history.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  hash: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @OneToMany(
    type => PaymentHistory,
    paymentHistory => paymentHistory.payment,
    { eager: false },
  )
  @JoinColumn()
  paymentHistory: PaymentHistory;

  @ManyToOne(
    type => User,
    user => user.payment,
    { nullable: true },
  )
  user: User;

  @CreateDateColumn()
  createDate: string;

  @UpdateDateColumn()
  updateDate: string;
}
