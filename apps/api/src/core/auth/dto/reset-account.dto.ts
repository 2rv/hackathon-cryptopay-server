import { IsNotEmpty, IsString } from 'class-validator';
import { Errors } from '../enum/errors.enum';

export class ResetAccountDto {
  @IsNotEmpty()
  @IsString()
  login: string;
}
