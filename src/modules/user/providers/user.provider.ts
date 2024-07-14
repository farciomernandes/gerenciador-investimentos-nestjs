import { Injectable } from '@nestjs/common';
import { User } from '../entities/users.entity';
import { CreateUserDto, UserResponseDto } from '../dtos/create-user.dto';
import { ICreateUserUseCase } from '../usecases/interfaces/create-user.interface';
import { IFindAllUsersUseCase } from '../usecases/find-all-users/interfaces/find-all-users.interface';

@Injectable()
export class UserProvider {
  constructor(
    private readonly createUserUseCase: ICreateUserUseCase,
    private readonly findAllUsersUseCase: IFindAllUsersUseCase,
  ) {}

  async createUser(payload: CreateUserDto): Promise<User> {
    return this.createUserUseCase.execute(payload);
  }

  async findAll(): Promise<UserResponseDto[]> {
    return this.findAllUsersUseCase.execute();
  }
}
