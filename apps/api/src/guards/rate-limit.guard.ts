import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';
import { CacheEntity } from 'libs/utils/src/cache';

export const RateLimit = time => SetMetadata('rateLimitTime', time);

const RateLimitCache = new CacheEntity({
  stdTTL: 180,
  checkperiod: 180,
  deleteOnExpire: true,
  maxKeys: 1000000,
});

const ERROR_ID = 'TOO_MANY_REQUEST';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const limitTimeProp = this.reflector.get<string[]>(
      'rateLimitTime',
      context.getHandler(),
    );

    const limitTime = limitTimeProp ? Number(limitTimeProp) : 180;

    const request = context.switchToHttp().getRequest();

    const cacheName = `${request.ip}-${request.route.path}`;

    const ipCache = RateLimitCache.get(cacheName);

    if (ipCache) {
      throw new HttpException(
        { message: ERROR_ID, limitTime },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    RateLimitCache.set(cacheName, { ip: request.ip }, limitTime);

    return true;
  }
}
