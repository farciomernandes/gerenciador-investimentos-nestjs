import { Injectable } from '@nestjs/common';
import { IAuthUseCase } from '../use-cases/login/interfaces/auth.interface';
import { IGetUserByJwtUseCase } from '../use-cases/get-user-by-jwt/interfaces/get-user-by-jwt.inteface';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { LoginDto } from '../dtos/login.dto';

@Injectable()
export class AuthProvider {
  constructor(
    private readonly authUseCase: IAuthUseCase,
    private readonly getUserByJwtUseCase: IGetUserByJwtUseCase,
  ) {}

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    return this.authUseCase.execute(payload);
  }

  async getUserbyId(id: string): Promise<any> {
    return this.getUserByJwtUseCase.execute(id);
  }
}
