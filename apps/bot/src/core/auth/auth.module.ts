import { User } from 'apps/api/src/core/auth/user.entity';
import { UserRepository } from 'apps/api/src/core/auth/user.repository';
import {
  createBackMainMenuButtons,
  deleteMenuFromContext,
  MenuTemplate,
} from 'telegraf-inline-menu/dist/source';
import { getRepository } from 'typeorm';
import { Context } from '../../type';
import { createQuestion, interactQuestion } from '../../utils/question';
import { addMessageToOld } from '../../utils/removeOldMessage';
import { FIELDS } from './constants/fields.constant';
import { generatePasswordSalt, generateBcryptHash } from 'libs/utils';
import { UserEntity } from '../user/user.entity';

const backButton = createBackMainMenuButtons(
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
  (ctx: Context) => ctx.i18n.t('COMMON.BUTTON_BACK'),
);

export async function InitAuthModule() {
  this.authMenu = new MenuTemplate((ctx: Context) => {
    if (this.isLogged) {
      return '';
    }
    return {
      text: ctx.i18n.t('AUTH.TITLE'),
      parse_mode: 'Markdown',
    };
  });

  this.menu.submenu(
    (ctx: Context) => {
      if (this.isLogged) {
        return '';
      }
      return ctx.i18n.t('MAIN_MENU.AUTH');
    },
    'auth',
    this.authMenu,
    {
      hide: () => {
        this.mainMenuToggle;
      },
    },
  );

  initFields.bind(this)();

  this.authMenu.interact(
    ctx => {
      return ctx.i18n.t('AUTH.CLEAR');
    },
    'AUTH_CLEAR',
    {
      do: ctx => {
        ctx.session.form = {};
        return true;
      },
    },
  );

  this.authMenu.interact(
    ctx => {
      ctx.session.repliedMenu = ctx?.update?.callback_query?.message.message_id;
      return ctx.i18n.t('AUTH.SUBMIT');
    },
    'AUTH_SUBMIT',
    {
      do: async (ctx, path) => {
        const errorId = ctx.session.form_error;

        if (errorId) {
          try {
            await ctx.deleteMessage(errorId);
          } catch (e) {}
        }

        const data = ctx.session?.form || {};

        const isFieldEmpty = Object.values(data).every(item => !item);

        if (isFieldEmpty) {
          const error = ctx.i18n.t('REQUEST_CREATE.ERROR_EMPTY_VALUES');
          const { message_id } = await ctx.reply(error);
          ctx.session.form_error = message_id;
          return true;
        }

        const { message_id } = await ctx.reply('Загрузка...');

        const { login, password } = data;

        try {
          const user = await getRepository(User).findOne({
            where: [{ login: login.toLowerCase() }],
          });

          if (user === undefined) {
            const reply = await ctx.reply('Пользователь не найден');
            ctx.session.form_error = reply.message_id;

            ctx.deleteMessage(message_id);
            return true;
          } else {
            const passwordCorrect = await validatePassword(
              user.password,
              password,
            );

            if (passwordCorrect === false) {
              const reply = await ctx.reply('Неверный пароль');
              ctx.session.form_error = reply.message_id;
              ctx.deleteMessage(message_id);
              return true;
            }
          }

          const newUser = new UserEntity();
          newUser.telegramId = ctx.session.noLoggedUserId;
          newUser.login = user.login;
          await newUser.save();

          ctx.session.logged = true;
          ctx.session.user = newUser;
          deleteMenuFromContext(ctx);
          this.openMenu(ctx);
        } catch (error) {}

        ctx.deleteMessage(message_id);
        ctx.deleteMessage(ctx.session.form_error);

        return true;
      },
    },
  );

  this.authMenu.manualRow(backButton);
}

function initFields() {
  FIELDS.map(({ name, field, nameTid, placeholderTid }) => {
    const question = createQuestion({
      name,
      field,
      menu: this.authMenu,
      bot: this.bot,
    });

    interactQuestion({
      name,
      field,
      menu: this.authMenu,
      question,
      nameTid,
      placeholderTid,
      small: false,
    });
  });
}

async function validatePassword(password, rawPassword) {
  const salt = await generatePasswordSalt(rawPassword);
  const hashPassword = generateBcryptHash(rawPassword, salt);
  return password === hashPassword;
}
