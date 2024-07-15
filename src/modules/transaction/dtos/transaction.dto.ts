import { ApiProperty } from '@nestjs/swagger';

export class TransactionDto {
  @ApiProperty({
    type: String,
    example: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
  })
  id: string;

  @ApiProperty({
    type: String,
    example: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
  })
  investment_id: string;

  @ApiProperty({
    type: String,
    example: '2024-07-14T21:32:52.888Z',
  })
  transaction_date: Date;

  @ApiProperty({
    type: Number,
    example: 2399,
  })
  amount: number;

  @ApiProperty({
    type: String,
    example: 'input',
  })
  type: string;

  @ApiProperty({
    type: Number,
    example: 1,
  })
  tax: number;

  @ApiProperty({
    type: Number,
    example: 235,
  })
  net_amount: number;
}
