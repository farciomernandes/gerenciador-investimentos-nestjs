import { ApiProperty } from '@nestjs/swagger';

import { ErrorMessage } from '../errorMessages';
import { Expose } from 'class-transformer';

export class UnauthorizedErrorDto implements ErrorMessage {
  @ApiProperty({
    description: 'Error message.',
    example: 'Failed to authenticate',
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: 'Error detail.',
    example: 'Necessary JWT Token',
  })
  @Expose()
  detail: string;
}

export class NotFoundErrorDto implements ErrorMessage {
  @ApiProperty({
    description: 'Error message.',
    example: 'Not found',
  })
  @Expose()
  message: string;

  @ApiProperty({
    description: 'Error detail.',
    example: 'Not found',
  })
  @Expose()
  detail: string;
}

export class InvalidParamsErrorDto {
  @ApiProperty({
    description: 'Status Code.',
    example: 400,
  })
  @Expose()
  statusCode: string;

  @ApiProperty({
    description: '',
    example: [
      'prop deve conter no mínimo 14 caracteres.',
      'prop deve ser uma string.',
    ],
  })
  @Expose()
  message: string[];

  @ApiProperty({
    description: 'Error type.',
    example: 'Bad Request',
  })
  @Expose()
  error: string;
}
