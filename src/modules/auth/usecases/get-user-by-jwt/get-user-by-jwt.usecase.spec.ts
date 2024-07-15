import { GetUserByJwtUseCase } from './get-user-by-jwt.usecase';
import { ValidUuidUtils } from '@infra/utils/valid-uuid.utils';
import { GetUserByJwtResponseDto } from '@modules/auth/dtos/get-user-by-jwt-response.dto';
import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';
import {
  makeFakeUser,
  makeUserRepositoryStub,
} from '@modules/auth/mocks/user.repository.mock';
import { BadRequestException } from '@nestjs/common';

jest.mock('@infra/typeorm/repositories/user.repository');
jest.mock('@infra/utils/valid-uuid.utils');

type SutTypes = {
  sut: GetUserByJwtUseCase;
  userRepositoryStub: UserRepositoryInterface;
  validUuidUtilsStub: ValidUuidUtils;
};

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const validUuidUtilsStub = new ValidUuidUtils();

  const sut = new GetUserByJwtUseCase(userRepositoryStub);

  return {
    sut,
    userRepositoryStub,
    validUuidUtilsStub,
  };
};

describe('GetUserByJwtUseCase', () => {
  test('Should throw BadRequestException if id is invalid', async () => {
    const { sut } = makeSut();

    const id = 'any_id';
    jest.spyOn(ValidUuidUtils, 'handle').mockReturnValue(false);

    await expect(sut.execute(id)).rejects.toThrow(BadRequestException);
  });

  test('Should throw BadRequestException if id is invalid', async () => {
    const { sut } = makeSut();

    const id = 'invalid_id';
    jest.spyOn(ValidUuidUtils, 'handle').mockReturnValue(false);

    const promise = sut.execute(id);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return GetUserByJwtResponseDto with correct user', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const id = 'any_id';
    const user = makeFakeUser();
    jest.spyOn(ValidUuidUtils, 'handle').mockReturnValue(true);
    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(user));

    const response = await sut.execute(id);

    expect(response).toEqual(GetUserByJwtResponseDto.toDto(user));
  });
});
