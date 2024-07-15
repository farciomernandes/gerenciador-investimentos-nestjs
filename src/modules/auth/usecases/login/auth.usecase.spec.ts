/* eslint-disable @typescript-eslint/no-unused-vars */
import { AuthUseCase } from './auth.usecase';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '@modules/auth/dtos/login.dto';
import { LoginResponseDto } from '@modules/auth/dtos/login-response.dto';
import { GetUserByJwtResponseDto } from '@modules/auth/dtos/get-user-by-jwt-response.dto';
import { BcryptCompareUtils } from '@infra/utils/bcrypt-compare.utils';
import { BadRequestException } from '@nestjs/common';
import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';

jest.mock('@nestjs/config', () => ({
  ConfigService: jest.fn().mockImplementation(() => ({
    get: jest.fn((key) => {
      if (key === 'JWT_SECRET_KEY') {
        return 'mock-secret-key';
      }
      if (key === 'JWT_EXPIRES_IN') {
        return '1h';
      }
      return null;
    }),
  })),
}));

type SutTypes = {
  sut: AuthUseCase;
  userRepositoryStub: UserRepositoryInterface;
  jwtServiceStub: JwtService;
  configServiceStub: ConfigService;
};

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const jwtServiceStub = new JwtService();
  const configServiceStub = new ConfigService();

  const sut = new AuthUseCase(
    jwtServiceStub,
    userRepositoryStub,
    configServiceStub,
  );

  return {
    sut,
    userRepositoryStub,
    jwtServiceStub,
    configServiceStub,
  };
};

describe('AuthUseCase', () => {
  test('Should call BcryptCompareUtils.handle with correct password', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const user = makeFakeUser();
    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(user));

    const handleSpy = jest.spyOn(BcryptCompareUtils, 'handle');
    handleSpy.mockResolvedValue(Promise.resolve(true));

    await sut.execute(makeLoginDto());

    expect(handleSpy).toHaveBeenCalledWith('any_password', user.password);
  });
  test('Should throw BadRequestException if user not found', async () => {
    const { sut, userRepositoryStub } = makeSut();

    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(null));

    const promise = sut.execute(makeLoginDto());
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should call BcryptCompareUtils.handle with correct password', async () => {
    const { sut, userRepositoryStub, jwtServiceStub } = makeSut();

    const user = makeFakeUser();
    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(user));

    jest.spyOn(jwtServiceStub, 'sign').mockImplementation((payload, secret) => {
      return 'signed-token';
    });

    const handleSpy = jest.spyOn(BcryptCompareUtils, 'handle');
    await sut.execute(makeLoginDto());

    expect(handleSpy).toHaveBeenCalledWith('any_password', user.password);
  });

  test('Should throw BadRequestException if password is invalid', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const user = makeFakeUser();
    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(user));

    jest
      .spyOn(BcryptCompareUtils, 'handle')
      .mockResolvedValueOnce(Promise.resolve(false));

    const promise = sut.execute(makeLoginDto());
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should return LoginResponseDto with correct token', async () => {
    const { sut, userRepositoryStub, jwtServiceStub, configServiceStub } =
      makeSut();

    const user = makeFakeUser();
    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(user));

    const signSpy = jest.spyOn(jwtServiceStub, 'signAsync');
    signSpy.mockResolvedValueOnce(Promise.resolve('any_token'));

    const response = await sut.execute(makeLoginDto());

    expect(response).toEqual(
      LoginResponseDto.toDto({
        token: 'any_token',
        expires_in: configServiceStub.get<string>('JWT_EXPIRES_IN'),
        user: GetUserByJwtResponseDto.toDto(user),
      }),
    );
  });
});

const makeUserRepositoryStub = (): UserRepositoryInterface => {
  class UserRepositoryStub implements UserRepositoryInterface {
    findOne(where: any): Promise<any> {
      return Promise.resolve(makeFakeUser());
    }
  }

  return new UserRepositoryStub();
};

const makeLoginDto = (): LoginDto => ({
  email: 'any_email@mail.com',
  password: 'any_password',
});

const makeFakeUser = (): any => ({
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'hashed_password',
});
