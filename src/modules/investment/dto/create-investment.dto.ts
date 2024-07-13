import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsDateString, IsNumber, Min } from 'class-validator';
import { InvestmentStatus } from '../enums/investments';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'The ID of the owner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  owner_id: string;

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

  @ApiProperty({
    description: 'The current value of the investment',
    example: 1100,
  })
  @IsNumber()
  @Min(0, { message: 'Current value must not be negative' })
  @IsNotEmpty()
  current_value: number;

  status: InvestmentStatus;
}
