import { IsNotEmpty, IsString } from 'class-validator';
import { Errors } from '../enum/errors.enum';

export interface ConfirmInfoDto {
  pgpEncryptedCode: string;
}
