import { randomUUID } from 'libs/utils/src/hash';
import { InternalServerErrorException } from '@nestjs/common';
import { CacheEntity } from 'libs/utils/src/cache';

const ConfirmKeyCache = new CacheEntity({
  stdTTL: 900,
  checkperiod: 900,
  deleteOnExpire: true,
  maxKeys: 1000000,
});

export class ConfirmKey {
  id: string;
  userId: number;
  value: string;

  constructor() {
    this.id = randomUUID();
  }

  async save() {
    const saved = await ConfirmKeyCache.set(this.id, {
      id: this.id,
      userId: this.userId,
      value: this.value,
      createDate: new Date().getTime(),
    });

    if (!saved) {
      throw new InternalServerErrorException();
    }
  }

  async reset() {
    return ConfirmKeyCache.del(this.id);
  }

  static async delete({ id }): Promise<void> {
    await ConfirmKeyCache.del(id);
  }

  static async getOne({ id }): Promise<ConfirmKey> {
    return ConfirmKeyCache.get(id);
  }
}
