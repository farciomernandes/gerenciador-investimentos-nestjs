import { ApiProperty, PickType } from '@nestjs/swagger';
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

export class CreatedInvestment extends PickType(CreateInvestmentDto, [
  'name',
  'creation_date',
  'initial_value',
  'current_value',
  'status',
] as const) {
  @ApiProperty({
    description: 'The date when the investment was created',
    example: '2024-07-14T16:05:51.755Z',
  })
  @IsNotEmpty()
  created_at: Date;

  @ApiProperty({
    description: 'The date when the investment was last updated',
    example: '2024-07-14T16:26:37.893Z',
  })
  @IsNotEmpty()
  updated_at: Date;

  @ApiProperty({
    description: 'The ID of the investment',
    example: '5ae8bfe0-f924-42c4-adbd-5336690dc3bf',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The current value of the investment',
    example: 2000,
  })
  @IsNotEmpty()
  current_value: number;

  @ApiProperty({
    description: 'The status of the investment',
    example: InvestmentStatus.IN_PROGRESS,
  })
  @IsNotEmpty()
  status: InvestmentStatus;
}
