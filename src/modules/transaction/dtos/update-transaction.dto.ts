import { ApiProperty } from '@nestjs/swagger';

export class UpdateTransactionDto {
  @ApiProperty({
    description: 'Investment ID',
    type: String,
  })
  investment_id?: string;

  @ApiProperty({
    description: 'Transaction date',
    type: Date,
  })
  transaction_date?: Date;

  @ApiProperty({
    description: 'Amount',
    type: Number,
  })
  amount?: number;

  @ApiProperty({
    description: 'Type (INPUT or OUTPUT)',
    type: String,
  })
  type?: string;

  tax?: number;

  @ApiProperty({
    description: 'Net amount',
    type: Number,
  })
  net_amount?: number;
}
