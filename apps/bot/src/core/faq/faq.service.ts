import { Context } from 'telegraf';

import { MenuTemplate, createBackMainMenuButtons } from 'telegraf-inline-menu';

export class FaqService {
  async sendInfo(ctx: Context) {
    ctx.reply(`Информация FAQ`);
  }
}
