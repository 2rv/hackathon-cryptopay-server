import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../core/auth/user.entity';
import { UserRole } from '../enums/user-role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Errors } from '../core/auth/enum/errors.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    @InjectRepository(User)
    private productRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { params } = request;

    if (isNaN(params.userId)) {
      throw new BadRequestException();
    }

    const user = await this.productRepository.findOne({
      where: { id: params.userId },
    });

    if (!user) {
      throw new BadRequestException(Errors.USER_WITH_THIS_ID_NOT_FOUND);
    }

    if (String(user.role) === String(UserRole.BLOCKED)) {
      return false;
    }

    request.userParam = user;

    return true;
  }
}
