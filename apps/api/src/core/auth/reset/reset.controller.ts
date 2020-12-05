import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
} from '@nestjs/common';
import { ResetService } from './reset.service';
import { ResetAccountDto } from '../dto/reset-account.dto';
import { ResetAccountInfoDto } from '../dto/reset-account-info.dto';
import { ResetAccountUpdateDto } from '../dto/reset-account-update.dto';
import { LoginInfoDto } from '../dto/login-info.dto';

@Controller('auth')
export class ResetController {
  constructor(private resetService: ResetService) {}

  @Post('/reset')
  getResetInfo(
    @Body(ValidationPipe)
    resetAccountDto: ResetAccountDto,
  ): Promise<ResetAccountInfoDto> {
    return this.resetService.getResetInfo(resetAccountDto);
  }

  @Get('/reset/:code')
  checkResetCode(@Param('code') code: string): Promise<void> {
    return this.resetService.checkResetCode(code);
  }

  @Post('/reset/:code')
  resetUpdateAccount(
    @Param('code') code: string,
    @Body(ValidationPipe)
    resetAccountUpdateDto: ResetAccountUpdateDto,
  ): Promise<LoginInfoDto> {
    return this.resetService.updateAccount(code, resetAccountUpdateDto);
  }
}
