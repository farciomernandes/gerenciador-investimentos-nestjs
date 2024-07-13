/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { CreateUserDto, UserResponseDto } from '../dtos/create-user.dto';
import { InvestmentStatus } from '@modules/investment/enums/investments';

@Injectable()
export class UserProvider {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    const alreadyExists = await this.userRepository.findOne({
      where: { email: payload.email },
    });

    if (alreadyExists) {
      throw new BadRequestException(
        `User with ${payload.email} email already exists!`,
      );
    }
    const user = this.userRepository.create(payload);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['investments', 'investments.owner'],
    });
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      const investments = user.investments.map((investment) => {
        return {
          owner_id: investment.owner.id,
          name: investment.name,
          creation_date: investment.creation_date,
          initial_value: Number(investment.initial_value),
          current_value: Number(investment.current_value),
          status: InvestmentStatus[investment.status],
        };
      });

      return { ...userWithoutPassword, investments };
    });
  }
}
