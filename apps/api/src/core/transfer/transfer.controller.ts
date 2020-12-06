import {
  Controller,
  UseGuards,
  Body,
  ValidationPipe,
  Post,
  Get,
} from '@nestjs/common';
import { TransferService } from './transfer.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../../decorators/get-account.decorator';
import { TransferDto } from './dto/transfer.dto';
import { User } from '../auth/user.entity';
import { AccountGuard } from '../../guards/account.guard';
import { GetTransferListDto } from './dto/get-transfer-list.dto';
import { TransferBalanceDto } from './dto/transfer-balance.dto';

@Controller('transfer')
export class TransferController {
  constructor(private transferService: TransferService) {}

  @Post('/user')
  @UseGuards(AuthGuard(), AccountGuard)
  transfer(
    @Body(ValidationPipe)
    transferDto: TransferDto,
    @GetAccount() account: User,
  ): Promise<TransferBalanceDto> {
    return this.transferService.transfer(account, transferDto);
  }

  @Get('/')
  @UseGuards(AuthGuard(), AccountGuard)
  getTransfer(@GetAccount() account: User): Promise<GetTransferListDto> {
    return this.transferService.getTransferList(account);
  }
}
