import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';
import { CreateUserUseCase } from './create-user.usecase';
import { BcryptHashUtils } from '@infra/utils/bcrypt-hash.utils';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';
import { User } from '@modules/user/entities/users.entity';
import { BadRequestException } from '@nestjs/common';
import { makeUserRepositoryStub } from '@modules/auth/mocks/user.repository.mock';

type SutTypes = {
  sut: CreateUserUseCase;
  userRepositoryStub: UserRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();

  const sut = new CreateUserUseCase(userRepositoryStub);

  return {
    sut,
    userRepositoryStub,
  };
};

describe('CreateUserUseCase', () => {
  test('Should throw BadRequestException if user already exists', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const createUserDto = new CreateUserDto();
    createUserDto.email = 'any_email';

    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(new User()));

    const promise = sut.execute(createUserDto);
    await expect(promise).rejects.toThrow(BadRequestException);
  });

  test('Should call BcryptHashUtils.handle with correct password', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const createUserDto = new CreateUserDto();
    createUserDto.password = 'any_password';

    const findSpy = jest.spyOn(userRepositoryStub, 'findOne');
    findSpy.mockReturnValueOnce(Promise.resolve(null));

    const handleSpy = jest.spyOn(BcryptHashUtils, 'handle');
    await sut.execute(createUserDto);

    expect(handleSpy).toHaveBeenCalledWith('any_password');
  });

  test('Should create and save user with correct data', async () => {
    const { sut, userRepositoryStub } = makeSut();

    const createUserDto = new CreateUserDto();
    createUserDto.email = 'any_email';
    createUserDto.password = 'any_password';

    jest
      .spyOn(userRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(null));
    jest
      .spyOn(BcryptHashUtils, 'handle')
      .mockResolvedValueOnce(Promise.resolve('hashed-password'));
    jest.spyOn(userRepositoryStub, 'create').mockReturnValue(new User());
    jest
      .spyOn(userRepositoryStub, 'save')
      .mockResolvedValueOnce(Promise.resolve(new User()));

    const user = await sut.execute(createUserDto);

    expect(userRepositoryStub.create).toHaveBeenCalledWith({
      ...createUserDto,
      password: 'hashed-password',
    });
    expect(userRepositoryStub.save).toHaveBeenCalledTimes(1);
    expect(user).toBeInstanceOf(User);
  });
});
