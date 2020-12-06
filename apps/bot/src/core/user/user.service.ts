import { getRepository } from 'typeorm';
import { UserEntity as TelegramUserEntity } from './user.entity';
import { User } from 'apps/api/src/core/auth/user.entity';

import { UserRepository } from './user.repository';

export class UserService {
  userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async userGuard(ctx) {
    let id = null;

    if (ctx.update.message) {
      id = ctx.update.message.chat.id;
    } else if (ctx.update.callback_query) {
      id = ctx.update.callback_query.message.chat.id;
    }

    if (ctx.session.logged) {
      try {
        const telegramUser = await getRepository(TelegramUserEntity).findOne({
          where: { telegramId: id },
        });

        const user = await getRepository(User).findOne({
          where: { login: telegramUser.login },
        });

        if (user) {
          ctx.state.user = { ...telegramUser, ...user };
          return null;
        }
      } catch (e) {
        console.log(`Произошла ошибка: ${e.message}`);
      }
    }
  }
}
