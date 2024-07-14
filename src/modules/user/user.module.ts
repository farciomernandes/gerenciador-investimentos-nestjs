import { Module } from '@nestjs/common';
import { UserProvider } from './providers/user.provider';
import { UserController } from './user.controller';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { ICreateUserUseCase } from './usecases/interfaces/create-user.interface';
import { CreateUserUseCase } from './usecases/create-user/create-user.use-case';
import { IFindAllUsersUseCase } from './usecases/find-all-users/interfaces/find-all-users.interface';
import { FindAllUsersUseCase } from './usecases/find-all-users/find-all-users.usecase';

@Module({
  imports: [],
  providers: [
    UserRepository,
    UserProvider,
    {
      provide: ICreateUserUseCase,
      useClass: CreateUserUseCase,
    },
    {
      provide: IFindAllUsersUseCase,
      useClass: FindAllUsersUseCase,
    },
  ],
  controllers: [UserController],
})
export class UserModule {}
