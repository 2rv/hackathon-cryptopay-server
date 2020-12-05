import { getRepository } from 'typeorm';
import { UserBalanceRepository } from '../payment/user-balance.repository';
import { UserBalanceService } from '../payment/user-balance.service';
import { UserEntity } from './user.entity';

import { UserRepository } from './user.repository';

export class UserService {
  userRepository: UserRepository;
  userBalanceService: UserBalanceService;

  constructor() {
    this.userRepository = new UserRepository();
    this.userBalanceService = new UserBalanceService();
  }

  async userGuard(ctx) {
    let id = null;

    if (ctx.update.message) {
      id = ctx.update.message.chat.id;
    } else if (ctx.update.callback_query) {
      id = ctx.update.callback_query.message.chat.id;
    }

    try {
      const user = await getRepository(UserEntity).findOne({
        where: { telegramId: id },
      });

      if (user) {
        ctx.state.user = user;
        return null;
      }

      const newUser = await this.userRepository.createUser(id);
      await this.userBalanceService.createUserBalance(newUser);
      ctx.state.user = newUser;
    } catch (e) {
      ctx.reply(`Произошла ошибка: ${e.message}`);
    }
  }
}
