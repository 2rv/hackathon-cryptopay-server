import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../auth/user.repository';
import { TransferRepository } from './transfer.repository';
import { UserBalanceRepository } from '../payment/user-balance/user-balance.repository';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      UserBalanceRepository,
      UserRepository,
      TransferRepository,
    ]),
  ],
  controllers: [TransferController],
  providers: [TransferService],
  exports: [],
})
export class TransferModule {}
