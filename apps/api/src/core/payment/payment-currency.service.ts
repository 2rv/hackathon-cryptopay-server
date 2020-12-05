import { HttpRequest } from '@app/utils/http';
import { Injectable } from '@nestjs/common';
import { CurrencyType } from '../../enums/currency.enum';

@Injectable()
export class PaymentCurrencyService {
  private async calcNumberFrom(value: number, fixed: number, url: string) {
    const { data } = await HttpRequest.get(url);
    let result = data.price * value;
    result = Number(result.toFixed(fixed));
    return result;
  }

  private async calcNumberTo(value: number, fixed: number, url: string) {
    const { data } = await HttpRequest.get(url);
    let result = value / data.price;
    result = Number(result.toFixed(fixed));
    return result;
  }

  async convertCurrency(from: CurrencyType, to: CurrencyType, value: number) {
    if (from === to) {
      return value;
    }

    if (from === CurrencyType.BTC && to === CurrencyType.USD) {
      return this.calcNumberFrom(
        value,
        2,
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
      );
    }

    if (from === CurrencyType.BTC && to === CurrencyType.RUB) {
      return this.calcNumberFrom(
        value,
        2,
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCRUB',
      );
    }

    if (from === CurrencyType.USD && to === CurrencyType.BTC) {
      return this.calcNumberTo(
        value,
        8,
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
      );
    }

    if (from === CurrencyType.RUB && to === CurrencyType.BTC) {
      return this.calcNumberTo(
        value,
        8,
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCRUB',
      );
    }
  }
}
