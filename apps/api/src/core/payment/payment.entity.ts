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
} from 'typeorm';
import { User } from '../auth/user.entity';
import { UserBalance } from '../payment/user-balance/user-balance.entity';

@Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @PrimaryColumn({ type: 'uuid' })
  @Generated('uuid')
  hash: string;

  @Column({ type: 'float', nullable: false })
  amount: number;

  @Column({ type: 'boolean', default: false })
  active: boolean;

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
