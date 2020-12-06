import { IsString, IsNumber } from 'class-validator';

export class TransferDto {
  @IsNumber()
  amount: number;

  @IsString()
  login: string;
}
