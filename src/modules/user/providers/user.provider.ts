/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { CreateUserDto, UserResponseDto } from '../dtos/create-user.dto';
import { CreateInvestmentDto } from '@modules/investment/dto/create-investment.dto';
import { InvestmentStatus } from '@modules/investment/enums/investments';

@Injectable()
export class UserProvider {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(payload);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find({
      relations: ['investments'],
    });
    return users.map((user) => {
      const { password, ...userWithoutPassword } = user;
      const investments = user.investments.map((investment) => ({
        owner_id: investment.owner.id,
        creation_date: investment.creation_date,
        initial_value: investment.initial_value,
        current_value: investment.current_value,
        status: InvestmentStatus[investment.status],
      })) as CreateInvestmentDto[];
      return { ...userWithoutPassword, investments };
    });
  }
}
