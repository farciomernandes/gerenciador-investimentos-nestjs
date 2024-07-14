import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { LoginResponseDto } from '@modules/auth/dtos/login-response.dto';
import { LoginDto } from '@modules/auth/dtos/login.dto';
import { AuthErrorMessages } from '@modules/auth/errors/messages/authErrorMessages';
import { BcryptCompareUtils } from '@infra/utils/bcrypt-compare.utils';
import { GetUserByJwtResponseDto } from '@modules/auth/dtos/get-user-by-jwt-response.dto';
import { IAuthUseCase } from './interfaces/auth.interface';

@Injectable()
export class AuthUseCase implements IAuthUseCase {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
  ) {}

  async execute(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException(AuthErrorMessages.InvalidLogin);
    }

    const passwordMatch = await BcryptCompareUtils.handle(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new BadRequestException(AuthErrorMessages.InvalidLogin);
    }

    const options: JwtSignOptions = {
      secret: this.configService.get<string>('JWT_SECRET_KEY'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    };

    const payload = {
      id: user.id,
    };
    const jwt = await this.jwtService.signAsync(payload, options);

    return LoginResponseDto.toDto({
      token: jwt,
      expires_in: options.expiresIn,
      user: GetUserByJwtResponseDto.toDto(user),
    });
  }
}
