import { Repository, EntityRepository } from 'typeorm';
import { UserEntity } from './user.entity';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async createUser(id): Promise<UserEntity> {
    const user: UserEntity = new UserEntity();

    user.telegramId = id;

    try {
      await user.save();
      return user;
    } catch (error) {
      throw new Error(error);
    }
  }
}
