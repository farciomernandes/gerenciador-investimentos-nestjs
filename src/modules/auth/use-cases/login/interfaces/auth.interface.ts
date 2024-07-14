import { LoginResponseDto } from '@modules/auth/dtos/login-response.dto';
import { LoginDto } from '@modules/auth/dtos/login.dto';

export abstract class IAuthUseCase {
  abstract execute(loginDto: LoginDto): Promise<LoginResponseDto>;
}
