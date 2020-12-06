import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Column,
} from 'typeorm';

@Entity({ name: 'telegram_user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: 'integer' })
  telegramId: number;

  @Column({ nullable: true, type: 'varchar' })
  login: string;

  @CreateDateColumn()
  createDate: string;
}
