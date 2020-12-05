import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyType } from '../../enums/currency.enum';
import { User } from '../auth/user.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { Payment } from './payment.entity';
import { PaymentRepository } from './payment.repository';
import { UserBalanceRepository } from './user-balance/user-balance.repository';
import { UserBalanceService } from './user-balance/user-balance.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(UserBalanceRepository)
    private userBalanceRepository: UserBalanceRepository,
    @InjectRepository(PaymentRepository)
    private paymentRepository: PaymentRepository,
    private userBalanceService: UserBalanceService,
  ) {}

  async createPaymentRequest(
    user,
    createPaymentRequestDto: CreatePaymentRequestDto,
  ): Promise<Payment> {
    return this.paymentRepository.createPayment(createPaymentRequestDto, user);
  }

  async payTransferByHash(transferId: number, user: User): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: [{ hash: transferId, active: true }],
      relations: ['user'],
    });

    if (!payment) {
      throw new NotFoundException();
    }

    if (payment.user.id === user.id) {
      throw new BadRequestException();
    }

    await this.userBalanceService.declineUserBalance(
      user,
      CurrencyType.BTC,
      payment.amount,
    );

    await this.userBalanceService.increaseUserBalance(
      payment.user,
      CurrencyType.BTC,
      payment.amount,
    );

    payment.active = false;
    await payment.save();
  }
}
