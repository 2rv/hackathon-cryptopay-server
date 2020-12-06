import { Context as TelegrafContext } from 'telegraf';
import { I18n } from 'telegraf-i18n';

import { UserEntity } from './core/user/user.entity';

export interface Context extends TelegrafContext {
  i18n: I18n;
  state: {
    user: UserEntity;
  };
  session: {
    noLoggedUserId: number;
    user: UserEntity;
    logged: boolean;
    form_error: number;
    oldMessage: [number];
    questionId: number;
    repliedMenu: number;
    form: any;
  };
}
