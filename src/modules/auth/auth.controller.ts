import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { Request as expressRequest } from 'express';
import { AuthProvider } from '@modules/auth/provider/auth.provider';
import { Public } from '@modules/auth/decorator/public';
import { LoginResponseDto } from '@modules/auth/dtos/login-response.dto';
import { LoginDto } from '@modules/auth/dtos/login.dto';
import { GetUserByJwtResponseDto } from '@modules/auth/dtos/get-user-by-jwt-response.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authProvider: AuthProvider) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Autenticar Usuário.',
    description:
      'Este endpoint é responsável por criar um token JWT para autenticar usuários.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @ApiBody({
    type: LoginDto,
    description: 'Payload para autenticar um usuário.',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authProvider.login(loginDto);
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Obter um Usuário pelo Cabeçalho de Autorização HTTP.',
    description:
      'Este endpoint é responsável por obter um Usuário pelo Cabeçalho de Autorização JWT na aplicação.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: GetUserByJwtResponseDto,
  })
  @ApiBearerAuth()
  async handle(
    @Request() req: expressRequest,
  ): Promise<GetUserByJwtResponseDto> {
    return await this.authProvider.getUserbyId(req?.user.id);
  }
}
