import { PipeTransform, Injectable } from '@nestjs/common';
import { AuthService } from '../core/auth/auth.service';
import { User } from '../core/auth/user.entity';

@Injectable()
export class UserEntityPipe implements PipeTransform {
  constructor(private readonly authService: AuthService) {}

  async transform(userId: number): Promise<User> {
    return this.authService.GetAccountById(userId);
  }
}
