import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserRole } from '../../enums/user-role.enum';
import { UserBalance } from '../payment/user-balance/user-balance.entity';
import { generatePasswordSalt, generateBcryptHash } from 'libs/utils';
import { Payment } from '../payment/payment.entity';

@Entity()
@Unique(['login'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: false })
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @OneToOne(
    type => UserBalance,
    balance => balance.user,
    { eager: false },
  )
  balance: UserBalance;

  @OneToMany(
    type => Payment,
    payment => payment.user,
    { eager: false },
  )
  @JoinColumn()
  payment: Payment;

  @CreateDateColumn()
  createDate: string;

  static async hashPassword(password: string): Promise<string> {
    const salt = await generatePasswordSalt(password);
    return generateBcryptHash(password, salt);
  }

  async validatePassword(password: string): Promise<boolean> {
    const salt = await generatePasswordSalt(password);
    const hashPassword = generateBcryptHash(password, salt);
    return this.password === hashPassword;
  }

  isConfirm(): boolean {
    return true;
  }
}
