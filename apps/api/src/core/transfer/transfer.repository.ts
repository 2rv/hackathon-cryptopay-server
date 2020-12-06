import { Repository, EntityRepository } from 'typeorm';
import { Errors } from './enum/errors.enum';
import { BadRequestException } from '@nestjs/common';
import { Transfer } from './transfer.entity';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../auth/user.entity';
import { GetTransferListDto } from './dto/get-transfer-list.dto';

@EntityRepository(Transfer)
export class TransferRepository extends Repository<Transfer> {
  async transferCreate(
    transferDto: TransferDto,
    account,
    user,
  ): Promise<Transfer> {
    const { amount, login } = transferDto;

    const transfer: Transfer = this.create();

    transfer.login = login;
    transfer.amount = amount;
    transfer.account = account.id;
    transfer.user = user.id;

    try {
      await transfer.save();
      return transfer;
    } catch (error) {
      throw new BadRequestException(Errors.INTERNAL_SERVER_ERROR);
    }
  }

  async getUserTransferList(user: User): Promise<GetTransferListDto> {
    const query = this.createQueryBuilder('transfer');

    query.leftJoinAndSelect('transfer.user', 'user');
    query.leftJoinAndSelect('transfer.account', 'account');

    query.where('user.id = :id OR account.id = :id', { id: user.id });

    query.orderBy('transfer.createDate', 'DESC');

    query.select([
      'transfer.id',
      'transfer.amount',
      'transfer.createDate',
      'transfer.currency',
      'transfer.active',
      'user.id',
      'account.id',
    ]);

    const list = await query.getMany();

    return {
      list,
    };
  }
}
