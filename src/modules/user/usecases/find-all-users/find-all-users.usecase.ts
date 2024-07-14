/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { UserResponseDto } from '@modules/user/dtos/create-user.dto';
import { IFindAllUsersUseCase } from './interfaces/find-all-users.interface';

@Injectable()
export class FindAllUsersUseCase implements IFindAllUsersUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserResponseDto[]> {
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
