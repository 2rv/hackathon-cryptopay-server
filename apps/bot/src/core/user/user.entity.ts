import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { UserBalanceEntity } from '../payment/user-balance.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'integer' })
  telegramId: number;

  @OneToOne(
    type => UserBalanceEntity,
    balance => balance.user,
    { eager: false },
  )
  balance: UserBalanceEntity;

  @CreateDateColumn()
  createDate: string;
}
