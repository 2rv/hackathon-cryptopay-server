import { Repository, EntityRepository } from 'typeorm';
import { UserBalance } from 'apps/api/src/core/payment/user-balance/user-balance.entity';

@EntityRepository(UserBalance)
export class UserBalanceRepository extends Repository<UserBalance> {}
