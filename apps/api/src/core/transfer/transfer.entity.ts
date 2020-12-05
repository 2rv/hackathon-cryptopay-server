import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../auth/user.entity';

@Entity()
export class Transfer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'float', default: 0 })
  amount: number;

  @Column({ nullable: false })
  login: string;

  @Column({ nullable: false, default: false })
  currency: string;

  @Column({ nullable: false, default: true })
  active: boolean;

  @CreateDateColumn()
  createDate: string;

  @ManyToOne(
    type => User,
    user => user.transfer,
  )
  @JoinColumn()
  user: User;

  @ManyToOne(
    type => User,
    account => account.transfer,
  )
  @JoinColumn()
  account: User;
}
