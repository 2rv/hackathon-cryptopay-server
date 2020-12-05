import {
  Entity,
  Unique,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserRole } from '../../enums/user-role.enum';
import { UserBalance } from '../payment/user-balance/user-balance.entity';
import { generatePasswordSalt, generateBcryptHash } from 'libs/utils';

@Entity()
@Unique(['login', 'nickname', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login: string;

  @Column({ nullable: false, unique: true })
  nickname: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    nullable: false,
  })
  role: UserRole;

  @Column({ nullable: true })
  pgp: string;

  @OneToOne(
    type => UserBalance,
    balance => balance.user,
    { eager: false },
  )
  balance: UserBalance;

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
