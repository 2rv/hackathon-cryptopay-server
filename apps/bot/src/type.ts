import { Context as TelegrafContext } from 'telegraf';
import { I18n } from 'telegraf-i18n';

import { UserBalanceEntity } from './core/payment/user-balance.entity';
import { RequestInterface } from './core/request/constants/request.interface';
import { RequestEntity } from './core/request/request.entity';
import { UserEntity } from './core/user/user.entity';

export interface Context extends TelegrafContext {
  i18n: I18n;
  state: {
    user: UserEntity;
    userBalance: UserBalanceEntity;
    requestList: RequestEntity[];
    requestListEmpty: boolean;
    form: any;
  };
  session: {
    form_error: number;
    form: RequestInterface;
    oldMessage: [number];
    questionId: number;
    repliedMenu: number;
  };
}
