import { Module } from '@nestjs/common';
import { UserProvider } from './providers/user.provider';
import { UserController } from './user.controller';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';

@Module({
  imports: [],
  providers: [UserRepository, UserProvider],
  controllers: [UserController],
})
export class UserModule {}
