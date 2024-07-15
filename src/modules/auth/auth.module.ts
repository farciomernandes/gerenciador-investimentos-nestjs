import { AuthController } from './auth.controller';
import { AuthUseCase } from './usecases/login/auth.usecase';
import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './guards/jwt.guard';
import { GetUserByJwtUseCase } from './usecases/get-user-by-jwt/get-user-by-jwt.usecase';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { AuthProvider } from './provider/auth.provider';
import { IGetUserByJwtUseCase } from './usecases/get-user-by-jwt/interfaces/get-user-by-jwt.inteface';
import { IAuthUseCase } from './usecases/login/interfaces/auth.interface';
import { UserRepositoryInterface } from './mocks/user.repository.interface';

@Global()
@Module({
  imports: [JwtModule.register({}), HttpModule],
  controllers: [AuthController],
  providers: [
    AuthUseCase,
    {
      provide: UserRepositoryInterface,
      useClass: UserRepository,
    },
    AuthProvider,
    UserRepository,
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: IAuthUseCase,
      useClass: AuthUseCase,
    },
    {
      provide: IGetUserByJwtUseCase,
      useClass: GetUserByJwtUseCase,
    },
    GetUserByJwtUseCase,
  ],
  exports: [AuthUseCase],
})
export class AuthModule {}
