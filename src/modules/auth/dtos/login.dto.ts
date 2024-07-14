import { ApiProperty } from '@nestjs/swagger';
import { Expose, plainToInstance } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty, IsString } from 'class-validator';
import { ExceptionMessages } from 'src/shared/messages/ExceptionMessages';

export class LoginDto {
  @Expose()
  @ApiProperty({
    description: 'CPF of the User.',
    example: '02665525401',
    required: true,
  })
  @IsString({ message: ExceptionMessages.isString('email') })
  @IsNotEmpty({ message: ExceptionMessages.isNotEmpty('email') })
  email: string;

  @Expose()
  @ApiProperty({
    description: 'Password of the User',
    example: '12345678',
    required: true,
  })
  @IsString({ message: ExceptionMessages.isString('password') })
  @IsNotEmpty({ message: ExceptionMessages.isNotEmpty('password') })
  @IsAlphanumeric('pt-BR', {
    message: ExceptionMessages.isAlphanumeric('password'),
  })
  password: string;

  static toDto(data: any): LoginDto {
    return plainToInstance(LoginDto, data, {
      excludeExtraneousValues: true,
    });
  }
}
