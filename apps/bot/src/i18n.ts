const path = require('path');

const TelegrafI18n = require('libs/i18n');

export const initI18n = () => {
  const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    directory: path.join(__dirname, '../../../apps/bot/src/lang'),
  });

  return i18n;
};
