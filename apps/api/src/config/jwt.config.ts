import { JwtModuleOptions } from '@nestjs/jwt';
import * as config from 'config';

const jwtConfig = config.get('jwt');

export const JwtConfig: JwtModuleOptions = {
  secret: process.env.JWT_SECRET || jwtConfig.secret,
  signOptions: { expiresIn: jwtConfig.expiresIn || process.env.JWT_EXPIRES_IN },
};
