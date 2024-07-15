import { ApiProperty } from '@nestjs/swagger';
import { TransactionResponse } from '@modules/transaction/dtos/list-transaction.dto';
import { IsNotEmpty } from 'class-validator';
import { InvestmentStatus } from '../enums/investments';

export class InvestmentDetailsResponse {
  @ApiProperty({
    description: 'The ID of the investment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The status of the investment',
    example: InvestmentStatus.IN_PROGRESS,
  })
  @IsNotEmpty()
  status: InvestmentStatus;

  @ApiProperty({
    description: 'The name of the investment',
    example: 'Ethereum',
  })
  name: string;

  @ApiProperty({
    description: 'The creation date of the investment',
    example: '2023-07-13T00:00:00.000Z',
  })
  @IsNotEmpty()
  creation_date: Date;

  @ApiProperty({
    description: 'The initial value of the investment',
    example: 1000,
  })
  @IsNotEmpty()
  initial_value: number;

  @ApiProperty({
    description: 'The initial value of the investment',
    example: 1000,
  })
  @IsNotEmpty()
  current_value: number;
}

export class ResponseInvestmentDetails {
  @ApiProperty({
    type: InvestmentDetailsResponse,
    example: {
      id: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
      name: 'Ethereum',
      creationDate: '2023-07-13T00:00:00.000Z',
      initialValue: 6000.0,
      currentValue: 10000.01,
      status: 'IN_PROGRESS',
      tax: 0,
      net_amount: 10000,
    },
  })
  investment: InvestmentDetailsResponse;

  @ApiProperty({
    type: [TransactionResponse],
    isArray: true,
    example: [
      {
        id: '7d1c5c1d-33ac-4bbd-9a40-ac240a7c51b5',
        investmentId: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
        transactionDate: '2024-07-14T21:32:52.888Z',
        amount: 77.0,
        type: 'INPUT',
        tax: 0.025,
        net_amount: 123,
      },
    ],
  })
  transactions: TransactionResponse[];

  @ApiProperty({
    example: 6385.295632287353,
  })
  expectedBalance: number;
}
