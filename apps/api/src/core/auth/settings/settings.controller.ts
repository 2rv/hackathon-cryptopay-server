import {
  Controller,
  Patch,
  UseGuards,
  Body,
  ValidationPipe,
  Post,
  Param,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'apps/api/src/guards/account.guard';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { GetAccount } from 'apps/api/src/decorators/get-account.decorator';
import { User } from '../user.entity';
import { ConfirmInfoDto } from '../dto/confirm-info.dto';
import { UpdateEmailDto } from '../dto/update-email.dto';
import { UpdatePgpDto } from '../dto/update-pgp.dto';

@Controller('auth')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Patch('/settings/password')
  @UseGuards(AuthGuard(), AccountGuard)
  updatePassword(
    @Body(ValidationPipe)
    updatePasswordDto: UpdatePasswordDto,
    @GetAccount() user: User,
  ): Promise<void> {
    return this.settingsService.updatePassword(user, updatePasswordDto);
  }

  @Post('/settings/password/confirm')
  @UseGuards(AuthGuard(), AccountGuard)
  getUpdatePasswordConfirmKey(
    @Body(ValidationPipe)
    updatePasswordDto: UpdatePasswordDto,
    @GetAccount() user: User,
  ): Promise<ConfirmInfoDto> {
    return this.settingsService.generateUpdatePasswordConfirmKey(
      user,
      updatePasswordDto,
    );
  }

  @Post('/settings/password/confirm/:code')
  @UseGuards(AuthGuard())
  updatePasswordByConfirmKey(@Param('code') code: string): Promise<void> {
    return this.settingsService.updatePasswordByConfirmKey(code);
  }

  @Patch('/settings/email')
  @UseGuards(AuthGuard(), AccountGuard)
  updateEmail(
    @Body(ValidationPipe)
    updateEmailDto: UpdateEmailDto,
    @GetAccount() user: User,
  ): Promise<UpdateEmailDto> {
    return this.settingsService.updateEmail(user, updateEmailDto);
  }

  @Post('/settings/email/confirm')
  @UseGuards(AuthGuard(), AccountGuard)
  getUpdateEmailConfirmKey(
    @Body(ValidationPipe)
    updateEmailDto: UpdateEmailDto,
    @GetAccount() user: User,
  ): Promise<ConfirmInfoDto> {
    return this.settingsService.generateUpdateEmailConfirmKey(
      user,
      updateEmailDto,
    );
  }

  @Post('/settings/email/confirm/:code')
  @UseGuards(AuthGuard())
  updateEmailByConfirmKey(@Param('code') code: string): Promise<void> {
    return this.settingsService.updateEmailByConfirmKey(code);
  }

  @Patch('/settings/pgp')
  @UseGuards(AuthGuard(), AccountGuard)
  updatePgp(
    @Body(ValidationPipe)
    updatePgpDto: UpdatePgpDto,
    @GetAccount() user: User,
  ): Promise<UpdatePgpDto> {
    return this.settingsService.updatePgp(user, updatePgpDto);
  }
}
