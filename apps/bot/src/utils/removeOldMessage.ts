export const removeOldMessage = async ctx => {
  const l = ctx.session.oldMessage;
  const e = ctx.session.form_error;
  const q = ctx.session.questionId;
  const f = ctx.session.form;

  if (l && l.length) {
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < l.length; i++) {
      try {
        await ctx.deleteMessage(l[i].message_id);
      } catch {}
    }
    ctx.session.oldMessage = [];
  }

  if (e) {
    try {
      await ctx.deleteMessage(e);
      ctx.session.form_error = null;
    } catch {}
  }

  if (q) {
    try {
      await ctx.deleteMessage(q);
      ctx.session.questionId = null;
    } catch {}
  }

  if (f) {
    ctx.session.form = null;
  }
};

export const addMessageToOld = async (data, ctx) => {
  if (ctx.session.oldMessage) {
    ctx.session.oldMessage.push(data);
  } else {
    ctx.session.oldMessage = [data];
  }
};
