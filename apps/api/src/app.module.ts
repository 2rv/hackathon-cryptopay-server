import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { BitcoinModule } from './core/bitcoin/bitcoin.module';
import { PaymentModule } from './core/payment/payment.module';
import { TransferModule } from './core/transfer/transfer.module';

@Module({
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(typeOrmConfig),
    AuthModule,
    BitcoinModule,
    PaymentModule,
    TransferModule,
  ],
})
export class AppModule {}
