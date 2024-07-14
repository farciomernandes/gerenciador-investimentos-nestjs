import { ApiProperty } from '@nestjs/swagger';

export class TransactionResponse {
  @ApiProperty({
    description: 'Transaction id',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Investment id',
    type: String,
  })
  investment_id: string;

  @ApiProperty({
    description: 'Transaction date',
    type: Date,
  })
  transaction_date: Date;

  @ApiProperty({
    description: 'Amount',
    type: Number,
  })
  amount: number;

  @ApiProperty({
    description: 'Type (INPUT or OUTPUT)',
    type: String,
  })
  type: string;

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

export class ListTransactionDto {
  @ApiProperty({
    description: 'List of transactions',
    type: TransactionResponse,
    isArray: true,
  })
  transactions: TransactionResponse[];

  @ApiProperty({
    description: 'Total pages',
    type: Number,
  })
  totalPages: number;
}
