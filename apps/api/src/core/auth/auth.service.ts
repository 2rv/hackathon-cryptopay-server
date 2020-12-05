import { UserRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Errors } from './enum/errors.enum';
import { LoginInfoDto } from './dto/login-info.dto';
import { AccountDataDto } from './dto/account-data.dto';
import { UserBalanceService } from '../payment/user-balance/user-balance.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private userBalanceService: UserBalanceService,
  ) {}

  async signUp(userSignUpDto: UserSignUpDto): Promise<LoginInfoDto> {
    const user: User = await this.userRepository.signUp(userSignUpDto);
    await this.userBalanceService.createUserBalance(user);

    const accessToken = await this.createJwt(user);

    return { accessToken };
  }

  async login(userLoginDto: UserLoginDto): Promise<LoginInfoDto> {
    const userData = await this.userRepository.login(userLoginDto);

    const accessToken = await this.createJwt(userData);

    const loginInfo: LoginInfoDto = { accessToken };
    return loginInfo;
  }

  async createJwt(user: User): Promise<string> {
    const { id, role } = user;

    const payload: JwtPayload = {
      id,
      role,
    };

    return this.jwtService.sign(payload);
  }

  async updateLogin(user: User): Promise<LoginInfoDto> {
    const accessToken = await this.createJwt(user);

    return { accessToken };
  }

  async GetAccountById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new NotFoundException(Errors.USER_WITH_THIS_ID_NOT_FOUND);
    }

    return user;
  }

  async getAccountInfo(user: User): Promise<AccountDataDto> {
    const accountData: AccountDataDto = {
      id: user.id,
      nickname: user.nickname,
      email: user.email,
      pgp: user.pgp,
      login: user.login,
    };

    return accountData;
  }
}
