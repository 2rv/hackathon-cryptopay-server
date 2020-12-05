import { createParamDecorator } from '@nestjs/common';
import { User } from '../core/auth/user.entity';

interface RequestData extends Request {
  userParam: User;
}

export const GetUser = createParamDecorator(
  (data: string, request: RequestData) => {
    const user: User = request.userParam;

    return data ? user && user[data] : user;
  },
);
