import { Repository, EntityRepository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Payment } from './payment.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { UserBalance } from './user-balance/user-balance.entity';
import { User } from '../auth/user.entity';

@EntityRepository(Payment)
export class PaymentRepository extends Repository<Payment> {
  async createPayment(
    createPaymentRequestDto: CreatePaymentRequestDto,
    user: User,
  ): Promise<Payment> {
    const { amount } = createPaymentRequestDto;

    const payment = new Payment();
    payment.amount = amount;
    payment.user = user;

    try {
      await payment.save();

      delete payment.user;

      return payment;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
