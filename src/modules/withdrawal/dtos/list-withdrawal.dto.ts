import { ApiProperty } from '@nestjs/swagger';

export class WithdrawalResponse {
  @ApiProperty({
    description: 'Withdrawal id',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Investment id',
    type: String,
  })
  investment_id: string;

  @ApiProperty({
    description: 'Withdrawal date',
    type: Date,
  })
  withdrawal_date: Date;

  @ApiProperty({
    description: 'List amount withdrawals',
    type: String,
  })
  amount: number;

  @ApiProperty({
    description: 'List of withdrawals',
    type: Number,
  })
  tax: number;

  @ApiProperty({
    description: 'List of withdrawals',
    type: Number,
  })
  net_amount: number;
}

export class ListWithdrawalDto {
  @ApiProperty({
    description: 'List of withdrawals',
    type: WithdrawalResponse,
    isArray: true,
  })
  withdrawals: WithdrawalResponse[];

  @ApiProperty({
    description: 'Total pages',
    type: Number,
  })
  totalPages: number;
}
