import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getLang = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const lang = request.body.lang;

    return lang;
  },
);
