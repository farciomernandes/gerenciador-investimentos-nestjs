/* eslint-disable @typescript-eslint/no-unused-vars */
import { User } from '@modules/user/entities/users.entity';
import { LoginDto } from '../dtos/login.dto';
import { UserRepositoryInterface } from './user.repository.interface';

export const makeUserRepositoryStub = (): UserRepositoryInterface => {
  class UserRepositoryStub implements UserRepositoryInterface {
    private mockUser = {
      id: 'valid-id',
      created_at: new Date(Date.now()),
      updated_at: new Date(Date.now()),
      deleted_at: new Date(Date.now()),
      email: 'valid-email@mail.com',
      investments: [],
      name: 'any_name',
      password: 'any_password',
    };
    findOne(where: any): Promise<any> {
      return Promise.resolve(makeFakeUser());
    }

    create(user: Partial<User>): User {
      return this.mockUser;
    }
    save(user: User): Promise<User> {
      return Promise.resolve(this.mockUser);
    }
    find(options: any): Promise<User[]> {
      return Promise.resolve([this.mockUser, this.mockUser]);
    }
  }

  return new UserRepositoryStub();
};

export const makeLoginDto = (): LoginDto => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const makeFakeUser = (): any => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});
