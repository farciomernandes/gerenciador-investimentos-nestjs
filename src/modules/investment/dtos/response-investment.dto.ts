import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { InvestmentStatus } from '../enums/investments';
import { Investment } from '../entities/investment.entity';
import { CreateInvestmentDto } from './create-investment.dto';

export class UserWithoutPassword {
  @ApiProperty({
    description: 'The ID of the owner',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    description: 'The name of the owner',
    example: 'John Doe',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The email of the owner',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  email: string;
}

export class InvestmentDto extends CreateInvestmentDto {
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
    description: 'The owner of the investment',
    type: UserWithoutPassword,
  })
  @IsNotEmpty()
  owner: UserWithoutPassword;

  static toDto(payload: Investment): InvestmentDto {
    const investmentDto = new InvestmentDto();
    investmentDto.id = payload.id;
    investmentDto.creation_date = payload.creation_date;
    investmentDto.current_value = Number(payload.current_value);
    investmentDto.initial_value = Number(payload.initial_value);
    investmentDto.owner_id = payload.owner.id;
    investmentDto.status = payload.status as InvestmentStatus;
    investmentDto.name = payload.name;

    const ownerWithoutPassword = new UserWithoutPassword();
    ownerWithoutPassword.id = payload.owner.id;
    ownerWithoutPassword.name = payload.owner.name;
    ownerWithoutPassword.email = payload.owner.email;
    investmentDto.owner = ownerWithoutPassword;

    return investmentDto;
  }
}

export class ResponseInvestmentDto {
  @ApiProperty({
    description: 'Total pages filtered',
    example: 1,
  })
  @IsNotEmpty()
  totalPages: number;

  @ApiProperty({
    description: 'List of investments',
    type: [InvestmentDto],
    isArray: true,
    example: [
      {
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Investment 1',
        currentValue: 1000,
        initialValue: 500,
        ownerId: '123e4567-e89b-12d3-a456-426614174000',
        status: InvestmentStatus.IN_PROGRESS,
        owner: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          name: 'John Doe',
          email: 'john.doe@example.com',
        },
      },
      {
        id: '234e5678-f90g-12h3-i456-426614174000',
        name: 'Investment 2',
        currentValue: 2000,
        initialValue: 1000,
        ownerId: '234e5678-f90g-12h3-i456-426614174000',
        status: InvestmentStatus.ACTIVE,
        owner: {
          id: '234e5678-f90g-12h3-i456-426614174000',
          name: 'Jane Doe',
          email: 'jane.doe@example.com',
        },
      },
    ],
  })
  @IsNotEmpty()
  investments: InvestmentDto[];

  static toDto(
    payloads: Investment[],
    totalPages: number,
  ): ResponseInvestmentDto {
    const investments = payloads.map((payload) => InvestmentDto.toDto(payload));

    const responseDto = new ResponseInvestmentDto();
    responseDto.investments = investments;
    responseDto.totalPages = totalPages;

    return responseDto;
  }
}
