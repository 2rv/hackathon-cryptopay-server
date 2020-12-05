import { InternalServerErrorException } from '@nestjs/common';
import { CacheEntity } from 'libs/utils/src/cache';
import { Intervales } from './enum/intervales.enum';

const ResetKeyCache = new CacheEntity({
  stdTTL: Intervales.LATEST_TRANSACTION_TTL,
  checkperiod: 900,
  deleteOnExpire: true,
  maxKeys: 1000000,
});

export class LastTransaction {
  id: string;
  address: string;

  constructor(txId: string, address: string) {
    this.id = txId;
    this.address = address;
  }

  async save() {
    const saved = await ResetKeyCache.set(this.id, {
      address: this.address,
    });

    if (!saved) {
      throw new InternalServerErrorException();
    }
  }

  static async getOne({ id }): Promise<LastTransaction> {
    return ResetKeyCache.get(id);
  }
}
