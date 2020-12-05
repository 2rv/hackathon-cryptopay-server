import { Injectable, Scope, BadRequestException } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Errors } from '../enum/errors.enum';
import { User } from '../user.entity';
import { ResetKey } from './reset-key.enity';
import { AuthService } from '../auth.service';
import { LoginInfoDto } from '../dto/login-info.dto';
import { ResetAccountUpdateDto } from '../dto/reset-account-update.dto';
import { ResetAccountDto } from '../dto/reset-account.dto';
import { ResetAccountInfoDto } from '../dto/reset-account-info.dto';
import { EncryptKey } from 'libs/utils/src/pgp';

@Injectable()
export class ResetService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}

  async getResetInfo(
    resetAccountDto: ResetAccountDto,
  ): Promise<ResetAccountInfoDto> {
    const { login } = resetAccountDto;
    const user: User = await this.userRepository.findOne({
      where: { login: login.toLowerCase() },
    });

    if (!user) {
      throw new BadRequestException(Errors.COULDNT_FOUND_USER);
    }

    if (!user.pgp) {
      throw new BadRequestException(Errors.USER_HAVENT_PGP);
    }

    const resetKey = new ResetKey();
    resetKey.userId = user.id;

    await resetKey.save();

    try {
      const pgpEncryptedCode = await EncryptKey(resetKey.id, user.pgp);
      return {
        pgpEncryptedCode,
      };
    } catch (error) {
      throw new BadRequestException(Errors.UNCORRECT_USER_PGP);
    }
  }

  async checkResetCode(codeId): Promise<void> {
    const resetKey = await ResetKey.getOne({ id: codeId });

    if (!resetKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }
  }

  async updateAccount(
    codeId: string,
    resetAccountUpdateDto: ResetAccountUpdateDto,
  ): Promise<LoginInfoDto> {
    const resetKey = await ResetKey.getOne({ id: codeId });

    if (!resetKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }

    const { userId } = resetKey;

    const user: User = await User.findOne({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }

    const { password } = resetAccountUpdateDto;
    user.password = await User.hashPassword(password);

    await ResetKey.delete({ id: codeId });
    await user.save();

    return this.authService.updateLogin(user);
  }
}
