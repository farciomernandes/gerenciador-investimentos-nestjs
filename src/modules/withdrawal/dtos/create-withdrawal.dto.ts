import { ApiProperty } from '@nestjs/swagger';

export class CreateWithdrawalDto {
  @ApiProperty({
    description: 'Investment ID',
    type: String,
  })
  investment_id: string;

  @ApiProperty({
    description: 'Withdrawal date',
    type: Date,
  })
  withdrawal_date: Date;

  @ApiProperty({
    description: 'Amount',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Tax',
    type: Number,
  })
  tax: number;

  @ApiProperty({
    description: 'Net amount',
    type: Number,
  })
  net_amount: number;
}
