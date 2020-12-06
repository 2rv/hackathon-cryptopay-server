import {
  BaseEntity,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';
import { Payment } from './payment.entity';

@Entity({ name: 'payment_history' })
export class PaymentHistory extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    type => User,
    user => user.paymentHistory,
  )
  user: User;

  @ManyToOne(
    type => Payment,
    payment => payment.paymentHistory,
  )
  payment: Payment;

  @CreateDateColumn()
  createDate: string;
}
