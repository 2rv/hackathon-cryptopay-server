import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePaymentRequestDto {
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
