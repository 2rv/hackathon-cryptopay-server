import { MenuTemplate, MenuMiddleware } from 'telegraf-inline-menu';

import { Context } from '../type';
import { Logger } from '@nestjs/common';
import { InitFaqModule } from './faq/faq.module';
import { InitBalanceModule } from './payment/payment.module';
import { Telegram } from 'telegraf';
import { removeOldMessage } from '../utils/removeOldMessage';

export class AppModule {
  menuMiddleware: MenuMiddleware<Context>;
  menu: MenuTemplate<Context>;
  mainMenuToggle = false;
  balanceMenuToggle = false;

  faqMenu: MenuTemplate<unknown>;
  balanceMenu: MenuTemplate<unknown>;

  initFaq: () => void;
  initBalance: () => void;
  bot: Telegram;

  constructor({ bot }) {
    this.bot = bot;
    this.initFaq = InitFaqModule.bind(this);
    this.initBalance = InitBalanceModule.bind(this);
  }

  async openMenu(ctx) {
    return this.menuMiddleware.replyToContext(ctx);
  }

  init() {
    this.menu = new MenuTemplate(async (ctx: Context) => {
      await removeOldMessage(ctx);
      return { text: ctx.i18n.t('WELCOME.TITLE'), parse_mode: 'Markdown' };
    });

    this.initFaq();
    this.initBalance();
    this.menuMiddleware = new MenuMiddleware('/', this.menu);
    Logger.log(this.menuMiddleware.tree());
  }
}
