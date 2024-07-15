import { FindAllUsersUseCase } from './find-all-users.usecase';
import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';
import { makeUserRepositoryStub } from '@modules/auth/mocks/user.repository.mock';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { User } from '@modules/user/entities/users.entity';

type SutTypes = {
  sut: FindAllUsersUseCase;
  userRepositoryStub: UserRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const sut = new FindAllUsersUseCase(userRepositoryStub);
  return { sut, userRepositoryStub };
};

describe('FindAllUsersUseCase', () => {
  test('Should call userRepository.find with correct relations', async () => {
    const { sut, userRepositoryStub } = makeSut();
    const findSpy = jest.spyOn(userRepositoryStub, 'find');
    await sut.execute();
    expect(findSpy).toHaveBeenCalledWith({
      relations: ['investments', 'investments.owner'],
    });
  });

  test('Should return an array of UserResponseDto', async () => {
    const { sut, userRepositoryStub } = makeSut();
    const users = [
      {
        id: 'valid-id',
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        deleted_at: new Date(Date.now()),
        email: 'valid-email@mail.com',
        investments: [],
        name: 'any_name',
        password: 'any_password',
      },
    ];
    jest
      .spyOn(userRepositoryStub, 'find')
      .mockResolvedValueOnce(Promise.resolve(users));
    const result = await sut.execute();
    expect(result).toBeInstanceOf(Array);
  });

  test('Should map user data correctly', async () => {
    const { sut, userRepositoryStub } = makeSut();
    const user1 = new User();
    user1.id = 'valid-id';
    user1.created_at = new Date(Date.now());
    user1.updated_at = new Date(Date.now());
    user1.deleted_at = new Date(Date.now());
    user1.email = 'any_email';
    user1.investments = [
      {
        owner_id: 'any_owner_id',
        name: 'any_name',
        creation_date: new Date(Date.now()),
        initial_value: 444,
        current_value: 444,
        status: InvestmentStatus.ACTIVE,
        id: '',
        owner: new User(),
        transactions: [],
        created_at: new Date(Date.now()),
        updated_at: new Date(Date.now()),
        deleted_at: new Date(Date.now()),
      },
    ];
    user1.name = 'any_name';
    user1.password = 'any_password';

    const findMock = jest.fn(() => Promise.resolve([user1]));
    jest.spyOn(userRepositoryStub, 'find').mockImplementation(findMock);

    const result = await sut.execute();
    expect(result[0].email).toBe('any_email');
    expect(result[0].investments[0].name).toBe('any_name');
    expect(result[0].investments[0].status).toBe(InvestmentStatus.ACTIVE);
  });
});
