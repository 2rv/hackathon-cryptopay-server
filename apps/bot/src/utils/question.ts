import { replyMenuToContext, getMenuOfPath } from 'telegraf-inline-menu';
import { Context } from '../type';

const TelegrafStatelessQuestion = require('telegraf-stateless-question');

export const createQuestion = ({ name, field, menu, bot }) => {
  const question = new TelegrafStatelessQuestion(
    name,
    async (ctx: Context, additionalState) => {
      const answer = ctx.message.text;

      if (!ctx.session.form) {
        ctx.session.form = {
          login: null,
          password: null,
          [field]: answer,
        };
      } else {
        ctx.session.form[field] = answer;
      }

      try {
        await Promise.all([
          ctx.deleteMessage(ctx.session.repliedMenu),
          ctx.deleteMessage(ctx.message.message_id),
          ctx.deleteMessage(ctx.message.reply_to_message.message_id),
        ]);
      } catch (e) {
        console.log(e);
      }

      const data = await replyMenuToContext(menu, ctx, additionalState);

      ctx.session.repliedMenu = data.message_id;

      return true;
    },
  );

  bot.use(question.middleware());

  return question;
};

export const interactQuestion = ({
  name,
  field,
  menu,
  question,
  nameTid,
  placeholderTid,
  small,
}) => {
  menu.interact(
    ctx => {
      const emptyField = ctx.i18n.t('AUTH.EMPTY_FIELD');
      const text = ctx.i18n.t(nameTid, {
        value: ctx.session?.form?.[field] || emptyField,
      });

      return text;
    },
    name,
    {
      joinLastRow: small,
      do: async (ctx: Context, path) => {
        if (ctx.session.questionId) {
          try {
            await ctx.deleteMessage(ctx.session.questionId);
          } catch (e) {}
        }

        if (ctx.session.form_error) {
          try {
            await ctx.deleteMessage(ctx.session.form_error);
          } catch (e) {}
        }

        const text = ctx.i18n.t(placeholderTid);
        const additionalState = getMenuOfPath(path);

        const data = await question.replyWithMarkdown(
          ctx,
          text,
          additionalState,
        );

        ctx.session.questionId = data.message_id;

        return true;
      },
    },
  );

  return menu;
};
