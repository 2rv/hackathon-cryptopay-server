import {
  Injectable,
  BadRequestException,
  MethodNotAllowedException,
} from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user.entity';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { Errors } from '../enum/errors.enum';
import { UpdatePgpDto } from '../dto/update-pgp.dto';
import { ResetService } from '../reset/reset.service';
import { ConfirmKey } from './confirm-key.enity';
import { EncryptKey } from 'libs/utils/src/pgp';
import { ConfirmInfoDto } from '../dto/confirm-info.dto';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private resetService: ResetService,
  ) {}

  async updatePassword(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<void> {
    const { password, key } = updatePasswordDto;

    if (user.pgp) {
      await this.resetService.checkResetCode(key);
    }

    user.password = await User.hashPassword(password);
    await user.save();
  }

  async generateUpdatePasswordConfirmKey(
    user: User,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<ConfirmInfoDto> {
    const { password } = updatePasswordDto;

    const confirmKey = new ConfirmKey();
    confirmKey.userId = user.id;
    confirmKey.value = password;

    await confirmKey.save();

    try {
      const pgpEncryptedCode = await EncryptKey(confirmKey.id, user.pgp);
      return {
        pgpEncryptedCode,
      };
    } catch (error) {
      throw new BadRequestException(Errors.UNCORRECT_USER_PGP);
    }
  }

  async updatePasswordByConfirmKey(codeId: string): Promise<void> {
    const confirmKey = await ConfirmKey.getOne({ id: codeId });

    if (!confirmKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }

    const { userId, value: password } = confirmKey;

    const user: User = await User.findOne({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }

    user.password = await User.hashPassword(password);

    await ConfirmKey.delete({ id: codeId });
    await user.save();
  }

  async updateEmail(
    currentUser: User,
    updateEmailDto: UpdateEmailDto,
  ): Promise<UpdateEmailDto> {
    const { email, key } = updateEmailDto;

    if (currentUser.pgp) {
      await this.resetService.checkResetCode(key);
    }

    const user: User = await this.userRepository.findOne({ where: { email } });

    if (user) {
      if (user.id === currentUser.id) {
        throw new BadRequestException(Errors.NEW_EMAIL_IS_CURRENT);
      } else {
        throw new BadRequestException(Errors.USER_WITH_THIS_EMAIL_EXISTS);
      }
    }

    currentUser.email = email;
    await currentUser.save();

    return updateEmailDto;
  }

  async updatePgp(
    user: User,
    updatePgpDto: UpdatePgpDto,
  ): Promise<UpdatePgpDto> {
    if (user.pgp) {
      throw new MethodNotAllowedException(Errors.CANNOT_CHANGE_PGP);
    }

    const { pgp } = updatePgpDto;
    user.pgp = pgp;
    await user.save();
    return updatePgpDto;
  }

  async generateUpdateEmailConfirmKey(
    user: User,
    updateEmailDto: UpdateEmailDto,
  ): Promise<ConfirmInfoDto> {
    const { email } = updateEmailDto;

    const confirmKey = new ConfirmKey();
    confirmKey.userId = user.id;
    confirmKey.value = email;

    await confirmKey.save();

    try {
      const pgpEncryptedCode = await EncryptKey(confirmKey.id, user.pgp);
      return {
        pgpEncryptedCode,
      };
    } catch (error) {
      throw new BadRequestException(Errors.UNCORRECT_USER_PGP);
    }
  }

  async updateEmailByConfirmKey(codeId: string): Promise<void> {
    const confirmKey = await ConfirmKey.getOne({ id: codeId });

    if (!confirmKey) {
      throw new BadRequestException(Errors.BAD_CONFIRM_CODE);
    }

    const { userId, value: email } = confirmKey;

    const user: User = await User.findOne({ id: userId });
    if (!user) {
      throw new BadRequestException();
    }

    user.email = email;

    await ConfirmKey.delete({ id: codeId });
    await user.save();
  }
}
