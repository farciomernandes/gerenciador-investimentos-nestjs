import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserProvider } from './providers/user.provider';
import { CreateUserDto, UserResponseDto } from './dtos/create-user.dto';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('api/v1/users')
@Controller('users')
export class UserController {
  constructor(private readonly userProvider: UserProvider) {}

  @Post()
  @ApiOperation({
    summary: 'Create user',
  })
  @ApiBody({
    type: CreateUserDto,
    description: 'Payload to create user',
  })
  @ApiOkResponse({
    description: 'Created user',
    type: CreateUserDto,
  })
  @HttpCode(HttpStatus.OK)
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userProvider.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Find all users',
  })
  @ApiOkResponse({
    description: 'Created user',
    type: UserResponseDto,
    isArray: true,
  })
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<UserResponseDto[]> {
    return this.userProvider.findAll();
  }
}
