import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdatePgpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(10000)
  pgp: string;
}
