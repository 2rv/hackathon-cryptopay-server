import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
} from '@nestjs/common';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetAccount } from '../../decorators/get-account.decorator';
import { User } from './user.entity';
import { AccountGuard } from '../../guards/account.guard';
import { LoginInfoDto } from './dto/login-info.dto';
import { AccountDataDto } from './dto/account-data.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(
    @Body(ValidationPipe) userSignUpDto: UserSignUpDto,
  ): Promise<LoginInfoDto> {
    return this.authService.signUp(userSignUpDto);
  }

  @Post('/login')
  logIn(
    @Body(ValidationPipe) userLoginDto: UserLoginDto,
  ): Promise<LoginInfoDto> {
    return this.authService.login(userLoginDto);
  }

  @Get('/token')
  @UseGuards(AuthGuard())
  checkToken(): void {}

  @Get('/account-data')
  @UseGuards(AuthGuard(), AccountGuard)
  getAccountData(@GetAccount() user: User): Promise<AccountDataDto> {
    return this.authService.getAccountInfo(user);
  }
}
