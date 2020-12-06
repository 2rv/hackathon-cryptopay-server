import { Logger } from '@nestjs/common';
import { AppModule } from './core/app.module';
import { UserService } from './core/user/user.service';

const LocalSession = require('telegraf-session-local');

import { initDatabaseConnection } from './database';
import { initTelegramConnection } from './telegram';
import { initI18n } from './i18n';
import { Context } from './type';

export async function bootstrap() {
  await initDatabaseConnection();

  const bot = await initTelegramConnection();

  bot.use(new LocalSession().middleware());

  bot.use(async (ctx, next) => {
    await userService.userGuard(ctx);
    next();
  });

  const i18n = initI18n();
  bot.use(i18n.middleware());

  const appModule = new AppModule({ bot });
  appModule.init();

  const userService = new UserService();

  bot.use(appModule.menuMiddleware.middleware());

  bot.command('start', async (ctx: Context) => {
    ctx.session.noLoggedUserId = ctx.update.message.from.id;
    const data = await appModule.openMenu(ctx);
    ctx.deleteMessage(data.message_id - 1);
  });

  await bot.launch();
  Logger.log('Started Telegram Server');
}

bootstrap();
