import { Module, forwardRef } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BitcoinModule } from '../bitcoin/bitcoin.module';
import { PaymentAddressService } from './payment-adress.service';
import { PaymentHistoryService } from './payment-history.service';
import { UserBalanceRepository } from './user-balance/user-balance.repository';
import { UserBalanceService } from './user-balance/user-balance.service';
import { PaymentCurrencyService } from './payment-currency.service';
import { PaymentRepository } from './payment.repository';
import { PaymentService } from './payment.service';
import { PaymentHistoryRepository } from './payment-history.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => BitcoinModule),
    TypeOrmModule.forFeature([
      UserBalanceRepository,
      PaymentRepository,
      PaymentHistoryRepository,
    ]),
  ],
  controllers: [PaymentController],
  providers: [
    UserBalanceService,
    PaymentAddressService,
    PaymentHistoryService,
    PaymentCurrencyService,
    PaymentService,
  ],
  exports: [
    UserBalanceService,
    PaymentAddressService,
    PaymentHistoryService,
    PaymentCurrencyService,
  ],
})
export class PaymentModule {}
