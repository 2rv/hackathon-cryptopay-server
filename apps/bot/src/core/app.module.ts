import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu';

import { Context } from '../type';
import { Logger } from '@nestjs/common';
import { InitFaqModule } from './faq/faq.module';
import { InitBalanceModule } from './payment/payment.module';
import { InitAuthModule } from './auth/auth.module';
import { Telegram } from 'telegraf';
import { removeOldMessage } from '../utils/removeOldMessage';
import { getRepository } from 'typeorm';
import { UserEntity } from './user/user.entity';

export class AppModule {
  menuMiddleware: MenuMiddleware<Context>;
  menu: MenuTemplate<Context>;
  mainMenuToggle = false;
  balanceMenuToggle = false;

  faqMenu: MenuTemplate<unknown>;
  balanceMenu: MenuTemplate<unknown>;

  initFaq: () => void;
  initBalance: () => void;
  initAuth: () => void;
  bot: Telegram;
  isLogged: boolean;

  constructor({ bot }) {
    this.bot = bot;
    this.initFaq = InitFaqModule.bind(this);
    this.initBalance = InitBalanceModule.bind(this);
    this.initAuth = InitAuthModule.bind(this);
  }

  async openMenu(ctx) {
    return this.menuMiddleware.replyToContext(ctx);
  }

  init() {
    this.menu = new MenuTemplate(async (ctx: Context) => {
      const user = await getRepository(UserEntity).findOne({
        where: { telegramId: ctx.update?.callback_query?.from?.id },
      });

      this.isLogged = !!user?.login;

      await removeOldMessage(ctx);

      return {
        text: this.isLogged
          ? ctx.i18n.t('WELCOME.TITLE_AUTH', { login: user?.login })
          : ctx.i18n.t('WELCOME.TITLE'),
        parse_mode: 'Markdown',
      };
    });

    this.initFaq();
    this.initBalance();
    this.initAuth();
    this.menuMiddleware = new MenuMiddleware('/', this.menu);
    Logger.log(this.menuMiddleware.tree());
  }
}
