import {
  ApiOkResponse,
  ApiOperation,
  ApiHeader,
  ApiTags,
  ApiBody,
} from '@nestjs/swagger';
import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Get,
  Request,
} from '@nestjs/common';
import { LoginResponseDto } from './dtos/login-response.dto';
import { LoginDto } from './dtos/login.dto';
import { Public } from './decorator/public';
import { GetUserByJwtResponseDto } from './dtos/get-user-by-jwt-response.dto';
import { Request as expressRequest } from 'express';
import { AuthProvider } from './provider/auth.provider';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authProvider: AuthProvider) {}

  @Post('login')
  @Public()
  @ApiOperation({
    summary: 'Authenticate User.',
    description:
      'This endpoint is responsible for creating JWT token for authenticate users',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: LoginResponseDto,
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authProvider.login(loginDto);
  }

  @Get('/me')
  @ApiOperation({
    summary: 'Get a User by HTTP Authorization Header.',
    description:
      'This endpoint is responsible for getting a User by JWT Authorization Header in the application.',
  })
  @ApiOkResponse({
    status: HttpStatus.OK,
    type: GetUserByJwtResponseDto,
  })
  @ApiHeader({
    name: 'Authorization',
    description: 'User authorization token',
    required: true,
  })
  async handle(
    @Request() req: expressRequest,
  ): Promise<GetUserByJwtResponseDto> {
    // Validar com middleware para pegar o user do request
    console.log('saca --------> ', req?.user);
    return await this.authProvider.getUserbyId('mock-id');
  }
}
