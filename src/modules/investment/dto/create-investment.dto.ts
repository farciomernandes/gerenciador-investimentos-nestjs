import { ApiProperty } from '@nestjs/swagger';

export class CreateInvestmentDto {
  @ApiProperty({
    description: 'The ID of the owner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  owner_id: string;

  @ApiProperty({
    description: 'The creation date of the investment',
    example: '2023-07-13T00:00:00.000Z',
  })
  creation_date: Date;

  @ApiProperty({
    description: 'The initial value of the investment',
    example: 1000,
  })
  initial_value: number;

  @ApiProperty({
    description: 'The current value of the investment',
    example: 1100,
  })
  current_value: number;

  @ApiProperty({
    description: 'The status of the investment',
    example: 'active',
  })
  status: string;
}
