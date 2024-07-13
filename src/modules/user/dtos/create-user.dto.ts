import { CreateInvestmentDto } from '@modules/investment/dto/create-investment.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @ApiProperty({ description: 'The name of the user', example: 'John Doe' })
  name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;
}

export class UserResponseDto extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({
    description: 'The list of investments',
    type: [CreateInvestmentDto],
  })
  @Type(() => CreateInvestmentDto)
  investments: CreateInvestmentDto[];
}
