import { Controller, Get, UseGuards, Post, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../../decorators/get-account.decorator';
import { User } from '../auth/user.entity';
import { UserBalanceDto } from './dto/user-balance.dto';
import { PaymentAddressService } from './payment-adress.service';
import { UserBitcoinAddressDto } from './dto/user-bitcoin-address';
import { PaymentHistoryService } from './payment-history.service';
import { BitcoinTransactionPaginationDto } from '../bitcoin/dto/bitcoin-transaction-pagination.dto';
import { UserBalanceService } from './user-balance/user-balance.service';
import { AccountGuard } from '../../guards/account.guard';

@Controller('payment')
export class PaymentController {
  constructor(
    private userBalanceService: UserBalanceService,
    private paymentAddressService: PaymentAddressService,
    private paymentHistoryService: PaymentHistoryService,
  ) {}

  @Get('/balance')
  @UseGuards(AuthGuard())
  async getAccountBalance(@GetAccount() user: User): Promise<UserBalanceDto> {
    return this.userBalanceService.getAccountBalance(user);
  }

  @Get('/address')
  @UseGuards(AuthGuard())
  async GetAccountPaymentAddress(
    @GetAccount() user: User,
  ): Promise<UserBitcoinAddressDto> {
    return this.paymentAddressService.GetAccountBitcoinAddress(user);
  }

  @Post('/address/bitcoin')
  @UseGuards(AuthGuard())
  async createUserBitcoinAddress(
    @GetAccount() user: User,
  ): Promise<UserBitcoinAddressDto> {
    return this.paymentAddressService.createUserBitcoinAddress(user);
  }

  @Get('/history/bitcoin')
  @UseGuards(AuthGuard())
  async GetAccountBitcoinHistory(
    @GetAccount() user: User,
    @Query('skip') skip: number,
    @Query('take') take: number,
  ): Promise<BitcoinTransactionPaginationDto> {
    return this.paymentHistoryService.getBitcoinPaymentHistoryList(
      user,
      skip,
      take,
    );
  }
}
