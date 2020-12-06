import { Logger } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegrafConfig } from './config/telegraf.config';

export const initTelegramConnection = async () => {
  const bot = new Telegraf(TelegrafConfig.botToken);
  bot.catch(error => console.log(error));
  Logger.log('Init Telegram Server');
  return bot;
};
