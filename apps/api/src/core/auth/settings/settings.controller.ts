import {
  Controller,
  Patch,
  UseGuards,
  Body,
  ValidationPipe,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AuthGuard } from '@nestjs/passport';
import { AccountGuard } from 'apps/api/src/guards/account.guard';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { GetAccount } from 'apps/api/src/decorators/get-account.decorator';
import { User } from '../user.entity';

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
}
