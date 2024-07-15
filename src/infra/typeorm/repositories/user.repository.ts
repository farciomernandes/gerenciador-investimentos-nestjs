import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/users.entity';
import { Injectable } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';

@Injectable()
export class UserRepository
  extends Repository<User>
  implements UserRepositoryInterface
{
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }
}
