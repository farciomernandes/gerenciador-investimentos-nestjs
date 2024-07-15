/* eslint-disable @typescript-eslint/no-unused-vars */
import { UserRepositoryInterface } from './user.repository.interface';

export const makeUserRepositoryMock = (): UserRepositoryInterface => {
  class UserRepositoryStub implements UserRepositoryInterface {
    findOne(where: any): Promise<any> {
      return Promise.resolve({ message: 'ok' });
    }
  }

  return new UserRepositoryStub();
};
