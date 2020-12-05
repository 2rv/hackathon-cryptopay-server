import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Errors } from '../enum/errors.enum';
import { User } from '../user.entity';

@Injectable()
export class PasswordGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { body, user }: { body: { password: string }; user: User } = request;

    if (!body || !user) {
      return false;
    }

    const { password } = body;

    if (!password) {
      return false;
    }

    const passwordCorrect = await user.validatePassword(password);

    if (!passwordCorrect) {
      throw new BadRequestException(Errors.UNCORRECT_CURRENT_PASSWORD);
    } else {
      return true;
    }
  }
}
