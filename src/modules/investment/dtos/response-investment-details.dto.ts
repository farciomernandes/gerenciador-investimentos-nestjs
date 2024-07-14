import { ApiProperty } from '@nestjs/swagger';
import { InvestmentDto } from './response-investment.dto';
import { TransactionResponse } from '@modules/transaction/dtos/list-transaction.dto';

export class ResponseInvestmentDetails {
  @ApiProperty({
    type: InvestmentDto,
    example: {
      id: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
      name: 'Ethereum',
      creationDate: '2023-07-13T00:00:00.000Z',
      initialValue: 6000.0,
      currentValue: 10000.01,
      status: 'IN_PROGRESS',
    },
  })
  investment: InvestmentDto;

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
        tax: null,
        netAmount: null,
      },
    ],
  })
  transactions: TransactionResponse[];

  @ApiProperty({
    example: 6385.295632287353,
  })
  expectedBalance: number;
}
