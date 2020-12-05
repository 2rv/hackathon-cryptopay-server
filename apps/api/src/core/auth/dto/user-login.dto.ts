import { IsNotEmpty, IsString } from 'class-validator';
import { Errors } from '../enum/errors.enum';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
