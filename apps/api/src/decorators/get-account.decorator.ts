import { createParamDecorator } from '@nestjs/common';
import { User } from '../core/auth/user.entity';

interface RequestData extends Request {
  user: User;
}

export const GetAccount = createParamDecorator(
  (data: string, request: RequestData) => {
    const user: User = request.user;

    return data ? user && user[data] : user;
  },
);
