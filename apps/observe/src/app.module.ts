import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseOptions } from './config/typeorm.config';
import { PaymentObserveModule } from './payment-observe/payment-observe.module';

@Module({
  controllers: [],
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot(databaseOptions),
    PaymentObserveModule,
  ],
})
export class AppModule {}
