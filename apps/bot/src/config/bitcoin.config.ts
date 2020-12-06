import * as config from 'config';

const bitcoinConfirg = config.get('BITCOIN');

export const BitcoinApiConfig = {
  protocol: 'http',
  host: process.env.BITCOIN_HOST || bitcoinConfirg.HOST,
  port: process.env.BITCOIN_PORT || bitcoinConfirg.PORT,
  username: process.env.BITCOIN_USERNAME || bitcoinConfirg.USERNAME,
  password: process.env.BITCOIN_PASSWORD || bitcoinConfirg.PASSWORD,
};
