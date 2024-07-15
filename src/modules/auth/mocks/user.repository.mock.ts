/* eslint-disable @typescript-eslint/no-unused-vars */
import { LoginDto } from '../dtos/login.dto';
import { UserRepositoryInterface } from './user.repository.interface';

export const makeUserRepositoryStub = (): UserRepositoryInterface => {
  class UserRepositoryStub implements UserRepositoryInterface {
    findOne(where: any): Promise<any> {
      return Promise.resolve(makeFakeUser());
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
