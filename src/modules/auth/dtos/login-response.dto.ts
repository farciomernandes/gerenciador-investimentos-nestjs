import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { AuthResponse } from './get-user-by-jwt-response.dto';

export class LoginResponseDto {
  @Expose()
  @ApiProperty({
    description: 'JWT authentication token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    required: true,
  })
  token: string;

  @Expose()
  @ApiProperty({
    description: 'JWT expiration time',
    example: '3600',
    required: true,
  })
  expires_in: string;

  @Expose()
  @ApiProperty({
    description: 'User data',
    example: {
      uuid: '025a7e25-a5d6-46d8-bd37-bf4b0113664b',
      name: 'John Doe',
      email: 'john@mail.com',
    },
    required: true,
  })
  user: AuthResponse;

  static toDto(data: any): LoginResponseDto {
    return plainToInstance(LoginResponseDto, data, {
      excludeExtraneousValues: false,
    });
  }
}
