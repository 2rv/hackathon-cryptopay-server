import { Module } from '@nestjs/common';
import { PaymentObserveService } from './payment-observe.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserBalanceService } from './user-balance.service';
import { BitcoinTransactionService } from './bitcoin-transaction.service';
import { BitcoinTransactionRepository } from './bitcoin-transaction.repository';
import { UserBalanceRepository } from './user-balance.repository';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      BitcoinTransactionRepository,
      UserBalanceRepository,
    ]),
  ],
  controllers: [],
  providers: [
    PaymentObserveService,
    BitcoinTransactionService,
    UserBalanceService,
  ],
})
export class PaymentObserveModule {}
