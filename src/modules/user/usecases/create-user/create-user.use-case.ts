import { Injectable } from '@nestjs/common';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { BadRequestException } from '@nestjs/common';
import { User } from '@modules/user/entities/users.entity';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import { BcryptHashUtils } from '@infra/utils/bcrypt-hash.utils';

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(payload: CreateUserDto): Promise<User> {
    const alreadyExists = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (alreadyExists) {
      throw new BadRequestException(
        `User with ${payload.email} email already exists!`,
      );
    }
    const hashedPassword = await BcryptHashUtils.handle(payload.password);

    const user = this.userRepository.create({
      ...payload,
      password: hashedPassword,
    });
    return this.userRepository.save(user);
  }
}
