import * as config from 'config';

const telegrafConfig = config.get('TELEGRAF');

export const TelegrafConfig = {
  botToken: process.env.BOT_TOKEN || telegrafConfig.BOT_TOKEN,
};
