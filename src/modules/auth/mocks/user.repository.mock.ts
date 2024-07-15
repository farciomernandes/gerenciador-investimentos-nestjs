/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@modules/user/entities/users.entity';
import { LoginDto } from '../dtos/login.dto';
import { UserRepositoryInterface } from './user.repository.interface';

export const makeUserRepositoryStub = (): UserRepositoryInterface => {
  class UserRepositoryStub implements UserRepositoryInterface {
    private mockUser = new User();
    constructor() {
      Object.assign(this.mockUser, {
        id: 'valid-id',
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        deleted_at: new Date(Date.now()),
        email: 'valid-email@mail.com',
        investments: [],
        name: 'any_name',
        password: 'any_password',
      });
    }
    findOneOrFail(options: any): Promise<any> {
      return Promise.resolve(makeFakeUser());
    }
    findOne(_where: any): Promise<any> {
      return Promise.resolve(makeFakeUser());
    }

    create(_user: Partial<User>): User {
      return this.mockUser;
    }
    save(_user: User): Promise<User> {
      return Promise.resolve(this.mockUser);
    }
    async find(_options: any): Promise<User[]> {
      const users = [this.mockUser, this.mockUser];
      return Promise.resolve(users);
    }
  }

  return new UserRepositoryStub();
};

export const makeLoginDto = (): LoginDto => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const makeFakeUser = (): User => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'hashed_password',
  investments: [],
  name: 'valid_name',
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
  deleted_at: new Date(Date.now()),
});
