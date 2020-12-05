import * as config from 'config';

const bitcoinConfirg = config.get('bitcoin');

export const BitcoinApiConfig = {
  protocol: 'http',
  host: process.env.BITCOIN_HOST || bitcoinConfirg.host,
  port: process.env.BITCOIN_PORT || bitcoinConfirg.port,
  username: process.env.BITCOIN_USERNAME || bitcoinConfirg.username,
  password: process.env.BITCOIN_PASSWORD || bitcoinConfirg.password,
};
