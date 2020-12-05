import { Injectable, Logger } from '@nestjs/common';
import { BitcoinApi } from 'libs/bitcoin-api/src';
import { BitcoinApiConfig } from '../../config/bitcoin.config';

@Injectable()
export class BitcoinService {
  private bitcoinApi: BitcoinApi;

  constructor() {
    this.bitcoinApi = new BitcoinApi(BitcoinApiConfig, Logger);
  }
  async generateBitcoinAddress(): Promise<string> {
    return this.bitcoinApi.getNewAddress();
  }
}
