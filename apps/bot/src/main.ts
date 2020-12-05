import { Logger } from '@nestjs/common';
import { AppModule } from './core/app.module';
import { UserService } from './core/user/user.service';

const LocalSession = require('telegraf-session-local');

import { initDatabaseConnection } from './database';
import { initTelegramConnection } from './telegram';
import { initI18n } from './i18n';

export async function bootstrap() {
  await initDatabaseConnection();

  const bot = await initTelegramConnection();

  bot.use(async (ctx, next) => {
    await userService.userGuard(ctx);
    next();
  });

  bot.use(new LocalSession().middleware());

  const i18n = initI18n();
  bot.use(i18n.middleware());

  const appModule = new AppModule({ bot });
  appModule.init();

  const userService = new UserService();

  bot.use(appModule.menuMiddleware.middleware());

  bot.command('start', async ctx => {
    const data = await appModule.openMenu(ctx);
    ctx.deleteMessage(data.message_id - 1);
  });

  await bot.launch();
  Logger.log('Started Telegram Server');
}

bootstrap();
