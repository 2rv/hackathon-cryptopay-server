import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyType } from '../../enums/currency.enum';
import { User } from '../auth/user.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { PaymentHistory } from './payment-history.entity';
import { PaymentHistoryRepository } from './payment-history.repository';
import { Payment } from './payment.entity';
import { PaymentRepository } from './payment.repository';
import { UserBalanceRepository } from './user-balance/user-balance.repository';
import { UserBalanceService } from './user-balance/user-balance.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentHistoryRepository)
    private paymentHistoryRepository: PaymentHistoryRepository,
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

  async getTransferByHash(transferId: string): Promise<Payment> {
    return this.paymentRepository.findOne({
      where: [{ hash: transferId }],
    });
  }

  async payTransferByHash(transferId: string, user: User): Promise<void> {
    const payment = await this.paymentRepository.findOne({
      where: [{ hash: transferId }],
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

    await this.paymentHistoryRepository.createPaymentHistory(payment, user);
  }

  async getPaymentHistory(user: User): Promise<PaymentHistory[]> {
    return this.paymentHistoryRepository.getPaymentHistory(user);
  }
}
