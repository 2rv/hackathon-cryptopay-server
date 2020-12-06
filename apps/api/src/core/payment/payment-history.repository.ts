import { Repository, EntityRepository } from 'typeorm';
import { InternalServerErrorException } from '@nestjs/common';
import { Payment } from './payment.entity';
import { CreatePaymentRequestDto } from './dto/create-payment-request.dto';
import { UserBalance } from './user-balance/user-balance.entity';
import { User } from '../auth/user.entity';
import { PaymentHistory } from './payment-history.entity';

@EntityRepository(PaymentHistory)
export class PaymentHistoryRepository extends Repository<PaymentHistory> {
  async createPaymentHistory(
    payment: Payment,
    user: User,
  ): Promise<PaymentHistory> {
    const paymentHistory = new PaymentHistory();

    paymentHistory.payment = payment;
    paymentHistory.user = user;

    try {
      await paymentHistory.save();

      return paymentHistory;
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async getPaymentHistory(user: User): Promise<PaymentHistory[]> {
    const query = this.createQueryBuilder('payment_history');

    query.leftJoin('payment_history.user', 'user');
    query.leftJoin('payment_history.payment', 'payment');
    query.leftJoin('payment.user', 'paymentUser');
    query.where(`paymentUser.id = ${user.id}`);

    query.select([
      'user.login',
      'payment.amount',
      'payment_history.createDate',
      'payment.hash',
    ]);

    return query.getMany();
  }
}
