import { IsNotEmpty, IsString } from 'class-validator';
import { Errors } from '../enum/errors.enum';

export interface AccountDataDto {
  id: number;
  login: string;
  nickname: string;
  email: string;
  pgp: string;
}
