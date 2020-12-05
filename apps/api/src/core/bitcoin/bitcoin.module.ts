import { Module, forwardRef } from '@nestjs/common';
import { BitcoinService } from './bitcoin.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentModule } from '../payment/payment.module';
import { BitcoinTransactionService } from './bitcoin-transaction.service';
import { BitcoinTransactionRepository } from './bitcoin-transaction.repository';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([BitcoinTransactionRepository]),
  ],
  controllers: [],
  providers: [BitcoinService, BitcoinTransactionService],
  exports: [BitcoinService, BitcoinTransactionService],
})
export class BitcoinModule {}
