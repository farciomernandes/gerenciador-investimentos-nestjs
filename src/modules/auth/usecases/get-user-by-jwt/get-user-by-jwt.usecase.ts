import { ValidUuidUtils } from '@infra/utils/valid-uuid.utils';
import { GetUserByJwtResponseDto } from '@modules/auth/dtos/get-user-by-jwt-response.dto';

import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseErrorMessages } from 'src/shared/errors/baseErrorMessages';
import { IGetUserByJwtUseCase } from './interfaces/get-user-by-jwt.inteface';
import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';

@Injectable()
export class GetUserByJwtUseCase implements IGetUserByJwtUseCase {
  constructor(private readonly userRepository: UserRepositoryInterface) {}

  async execute(id: string): Promise<any> {
    if (!ValidUuidUtils.handle(id)) {
      throw new BadRequestException(BaseErrorMessages.InvalidId);
    }

    const user = await this.userRepository.findOne({
      where: { id },
    });

    return GetUserByJwtResponseDto.toDto(user);
  }
}
