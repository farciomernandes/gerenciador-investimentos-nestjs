import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsNumber, Min } from 'class-validator';
import { InvestmentStatus } from '../enums/investments';

export class CreateInvestmentDto {
  owner_id: string;

  @ApiProperty({
    description: 'The name of the investment',
    example: 'Ethereum',
  })
  name: string;

  @ApiProperty({
    description: 'The creation date of the investment',
    example: '2023-07-13T00:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  creation_date: Date;

  @ApiProperty({
    description: 'The initial value of the investment',
    example: 1000,
  })
  @IsNumber()
  @Min(0, { message: 'Initial value must not be negative' })
  @IsNotEmpty()
  initial_value: number;

  current_value: number;

  status: InvestmentStatus;
}
