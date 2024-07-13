import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from '@modules/user/entities/users.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }
}
