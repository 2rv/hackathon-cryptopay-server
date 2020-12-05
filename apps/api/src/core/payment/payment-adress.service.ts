import { Injectable, MethodNotAllowedException } from '@nestjs/common';
import { User } from '../auth/user.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { BitcoinService } from '../bitcoin/bitcoin.service';
import { UserBitcoinAddressDto } from './dto/user-bitcoin-address';
import { Errors } from './enum/errors.enum';
import { UserBalanceRepository } from './user-balance/user-balance.repository';

@Injectable()
export class PaymentAddressService {
  constructor(
    @InjectRepository(UserBalanceRepository)
    private userBalanceRepository: UserBalanceRepository,
    private bitcoinService: BitcoinService,
  ) {}

  async GetAccountBitcoinAddress(user: User): Promise<UserBitcoinAddressDto> {
    const balance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    const address = balance.bitcoinAddress ? balance.bitcoinAddress : null;

    return {
      bitcoinAddress: address,
    };
  }

  async createUserBitcoinAddress(user: User): Promise<UserBitcoinAddressDto> {
    const balance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    if (balance.bitcoinAddress) {
      throw new MethodNotAllowedException(
        Errors.USER_BITCOIN_ADDRESS_ALREADY_EXISTS,
      );
    }

    const bitcoinAddress = await this.bitcoinService.generateBitcoinAddress();

    balance.bitcoinAddress = bitcoinAddress;
    await balance.save();

    return {
      bitcoinAddress,
    };
  }
}
