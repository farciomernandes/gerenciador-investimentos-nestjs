import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type, plainToInstance } from 'class-transformer';

export class AuthResponse {
  @ApiProperty({
    description: 'User id',
    example: '025a7e25-a5d6-46d8-bd37-bf4b0113664b',
    required: true,
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'Jhon Doe',
    required: true,
  })
  @Expose()
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'anyemail@email.com',
    required: true,
  })
  @Expose()
  email: string;

  @Expose()
  @ApiProperty({
    description: 'The created date of the User.',
    example: '2022-01-01 15:00:00',
    required: true,
  })
  created_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The updated date of the User.',
    example: '2022-01-01 15:00:00',
    required: true,
  })
  updated_at: Date;

  @Expose()
  @ApiProperty({
    description: 'The deleted date of the User.',
    example: null,
    required: false,
  })
  deleted_at: Date;
}

export class GetUserByJwtResponseDto {
  @Expose()
  @Type(() => AuthResponse)
  @ApiProperty({
    description: 'WorkDays data',
    type: [AuthResponse],
    required: true,
  })
  user: AuthResponse;

  static toDto(data: any): GetUserByJwtResponseDto {
    return plainToInstance(GetUserByJwtResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
