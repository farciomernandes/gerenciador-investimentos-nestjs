import { TransactionTypes } from '@modules/transaction/enums/transaction';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateInvestmentDto {
  @ApiProperty({
    description: 'The amount',
    example: 3000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The amount',
    example: 'output',
  })
  @IsNotEmpty()
  type: TransactionTypes.INPUT | TransactionTypes.OUTPUT;
}

export class TransactionInvestmentDto {
  @ApiProperty({
    description: 'The amount',
    example: 3000,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
