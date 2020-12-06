import { UserRepository } from '../auth/user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, BadRequestException } from '@nestjs/common';
import { User } from '../auth/user.entity';
import { TransferDto } from './dto/transfer.dto';
import { Errors } from './enum/errors.enum';
import { UserBalanceRepository } from '../payment/user-balance/user-balance.repository';
import { TransferRepository } from './transfer.repository';
import { GetTransferListDto } from './dto/get-transfer-list.dto';
import { TransferBalanceDto } from './dto/transfer-balance.dto';

@Injectable()
export class TransferService {
  constructor(
    @InjectRepository(UserBalanceRepository)
    private userBalanceRepository: UserBalanceRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(TransferRepository)
    private transferRepository: TransferRepository,
  ) {}

  async transfer(
    account: User,
    transferDto: TransferDto,
  ): Promise<TransferBalanceDto> {
    const { login } = transferDto;

    const amount = Number(transferDto.amount);

    const user = await this.userRepository.findOne({
      where: { login },
    });

    if (!user) {
      throw new BadRequestException(Errors.THIS_USER_NOT_FOUND);
    }

    const userBalance = await this.userBalanceRepository.findOne({
      where: { user },
    });

    const accountBalance = await this.userBalanceRepository.findOne({
      where: { user: account },
    });

    if (accountBalance.bitcoinBalance < amount) {
      throw new BadRequestException(Errors.NOT_ENOUGH_BALANCE);
    }

    accountBalance.bitcoinBalance = accountBalance.bitcoinBalance - amount;

    await accountBalance.save();

    userBalance.bitcoinBalance = userBalance.bitcoinBalance + amount;

    await userBalance.save();

    await this.transferRepository.transferCreate(transferDto, account, user);

    return accountBalance;
  }

  async getTransferList(user: User): Promise<GetTransferListDto> {
    return this.transferRepository.getUserTransferList(user);
  }
}
