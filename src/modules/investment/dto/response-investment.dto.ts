import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { InvestmentStatus } from '../enums/investments';
import { Investment } from '../entities/investment.entity';
import { CreateInvestmentDto } from './create-investment.dto';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';

export class UserWithoutPassword extends OmitType(CreateUserDto, [
  'password',
] as const) {
  @ApiProperty({
    description: 'The ID of the owner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  id: string;
}

export class ResponseInvestmentDto extends CreateInvestmentDto {
  @ApiProperty({
    description: 'The status of the investment',
    example: InvestmentStatus.IN_PROGRESS,
  })
  @IsNotEmpty()
  status: InvestmentStatus;

  @ApiProperty({
    description: 'The owner of the investment',
    type: UserWithoutPassword,
  })
  @IsNotEmpty()
  owner: UserWithoutPassword;

  static toDto(payload: Investment): ResponseInvestmentDto {
    return {
      creation_date: payload.created_at,
      current_value: payload.current_value,
      initial_value: payload.initial_value,
      owner_id: payload.owner.id,
      status: InvestmentStatus[payload.status],
      owner: {
        id: payload.owner.id,
        name: payload.owner.name,
        email: payload.owner.email,
      } as UserWithoutPassword,
    };
  }
}
