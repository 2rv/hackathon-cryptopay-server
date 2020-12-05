import { RequestHanlder } from './hanlder';

interface BitcoinApiConfig {
  host: string;
  port: string;
  username: string;
  password: string;
}

export class BitcoinApi {
  url: string;
  logger;

  constructor(config: BitcoinApiConfig, loggerClass) {
    this.url = `http://${config.username}:${config.password}@${config.host}:${config.port}`;
    this.logger = new loggerClass('BitcoinCore');
    this.getInit();
  }

  private getInit() {
    this.logger.log('Checking connection to Bitcoin RPC Rest ');

    this.getInfo()
      .then(() => {
        this.logger.log('Bitcoin RPC Rest connection is success');
      })
      .catch(error => {
        this.logger.log('Bitcoin RPC Rest connection fail');
        this.logger.log(error);
      });
  }

  getInfo(): Promise<{}> {
    return RequestHanlder(this.url, 'getnetworkinfo');
  }

  getNewAddress(): Promise<string> {
    return RequestHanlder(this.url, 'getnewaddress');
  }

  getTransaction(tx: string): Promise<{ confirmations: number }> {
    return RequestHanlder(this.url, 'gettransaction', [tx]);
  }

  getAddressInfo(address: string): Promise<{}> {
    return RequestHanlder(this.url, 'getaddressinfo', [address]);
  }

  getListTransactions(): Promise<[]> {
    return RequestHanlder(this.url, 'listtransactions', ['*', 100]);
  }
}
