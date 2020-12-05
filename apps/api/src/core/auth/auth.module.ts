import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtConfig } from '../../config/jwt.config';
import { JwtStrategy } from './jwt.strategy';
import { SettingsService } from './settings/settings.service';
import { ResetService } from './reset/reset.service';
import { PaymentModule } from '../payment/payment.module';
import { ResetController } from './reset/reset.controller';
import { SettingsController } from './settings/settings.controller';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register(JwtConfig),
    TypeOrmModule.forFeature([UserRepository]),
    forwardRef(() => PaymentModule),
  ],
  controllers: [AuthController, ResetController, SettingsController],
  providers: [AuthService, JwtStrategy, SettingsService, ResetService],
  exports: [JwtStrategy, PassportModule, AuthService],
})
export class AuthModule {}
