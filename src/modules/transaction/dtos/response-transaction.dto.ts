import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class ResponseInvestmentTransactionDto {
  @ApiProperty({
    description: 'The ID of the investment',
    example: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
  })
  @IsNotEmpty()
  @IsUUID()
  investment_id: string;

  @ApiProperty({
    description: 'The date of the transaction',
    example: '2024-07-14T16:30:33.870Z',
  })
  @IsNotEmpty()
  @IsDate()
  transaction_date: Date;

  @ApiProperty({
    description: 'The amount of the transaction',
    example: 3192.6478161436767,
  })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'The type of the transaction (INPUT or OUTPUT)',
    example: 'INPUT',
  })
  @IsNotEmpty()
  type: string;

  @ApiProperty({
    description: 'The tax applied to the transaction',
    example: 590.6398459865802,
  })
  @IsNotEmpty()
  @IsNumber()
  tax: number;

  @ApiProperty({
    description: 'The net amount after tax',
    example: 2602.0079701570967,
  })
  @IsNotEmpty()
  @IsNumber()
  net_amount: number;

  @ApiProperty({
    description: 'The date when the transaction record was created',
    example: '2024-07-14T16:30:33.873Z',
  })
  @IsNotEmpty()
  @IsDate()
  created_at: Date;

  @ApiProperty({
    description: 'The date when the transaction record was last updated',
    example: '2024-07-14T16:30:33.873Z',
  })
  @IsNotEmpty()
  @IsDate()
  updated_at: Date;

  @ApiProperty({
    description: 'The date when the transaction record was deleted',
    example: null,
  })
  @IsOptional()
  @IsDate()
  deleted_at: Date | null;

  @ApiProperty({
    description: 'The ID of the transaction record',
    example: '8d2f300f-4731-4598-bbce-3c6e9e9cc50f',
  })
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
