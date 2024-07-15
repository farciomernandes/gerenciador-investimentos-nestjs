import { CreateInvestmentUseCase } from './create-investment.usecase';
import { CreateInvestmentDto } from '../../dtos/create-investment.dto';
import { Investment } from '@modules/investment/entities/investment.entity';
import { TransactionRepositoryInterface } from '@modules/transaction/mocks/transaction.respository.interface';
import {
  makeTransactionMock,
  makeTransactionRepositoryStub,
} from '@modules/transaction/mocks/transaction.repository.mock';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';
import {
  makeFakeUser,
  makeUserRepositoryStub,
} from '@modules/auth/mocks/user.repository.mock';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { UserRepositoryInterface } from '@modules/auth/mocks/user.repository.interface';

type SutTypes = {
  sut: CreateInvestmentUseCase;
  userRepositoryStub: UserRepositoryInterface;
  investmentRepositoryStub: InvestmentRepositoryInterface;
  transactionRepositoryStub: TransactionRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const userRepositoryStub = makeUserRepositoryStub();
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const transactionRepositoryStub = makeTransactionRepositoryStub();
  const sut = new CreateInvestmentUseCase(
    userRepositoryStub,
    investmentRepositoryStub,
    transactionRepositoryStub,
  );
  return {
    sut,
    userRepositoryStub,
    investmentRepositoryStub,
    transactionRepositoryStub,
  };
};

describe('CreateInvestmentUseCase', () => {
  test('Should create a new investment', async () => {
    const {
      sut,
      userRepositoryStub,
      investmentRepositoryStub,
      transactionRepositoryStub,
    } = makeSut();
    const createInvestmentDto = new CreateInvestmentDto();
    createInvestmentDto.owner_id = makeInvestmentMock().owner_id;
    createInvestmentDto.name = makeInvestmentMock().name;
    createInvestmentDto.initial_value = makeInvestmentMock().initial_value;
    createInvestmentDto.creation_date = makeInvestmentMock().creation_date;

    const user = makeFakeUser();
    jest
      .spyOn(userRepositoryStub, 'findOneOrFail')
      .mockResolvedValueOnce(Promise.resolve(user));

    const investment = makeInvestmentMock();
    jest
      .spyOn(investmentRepositoryStub, 'create')
      .mockReturnValueOnce(investment);
    jest
      .spyOn(investmentRepositoryStub, 'save')
      .mockResolvedValueOnce(Promise.resolve(investment));
    jest
      .spyOn(investmentRepositoryStub, 'getWithTransactions')
      .mockReturnValueOnce(Promise.resolve(false));

    const transaction = makeTransactionMock();
    transaction.transaction_date = new Date();
    jest
      .spyOn(transactionRepositoryStub, 'create')
      .mockReturnValueOnce(transaction);
    jest
      .spyOn(transactionRepositoryStub, 'save')
      .mockResolvedValueOnce(Promise.resolve(transaction));

    const result = await sut.execute(createInvestmentDto);

    expect(result).toEqual(
      expect.objectContaining({
        investment: expect.objectContaining({
          id: 'valid-id',
          name: 'Any Investment',
          initial_value: 1000,
          current_value: 1000,
          status: 'ACTIVE',
        }),
        transactions: expect.arrayContaining([
          expect.objectContaining({
            id: 'valid-id',
            investment_id: 'valid-investment-id',
            amount: 100,
            type: 'INPUT',
            tax: 0.1,
            net_amount: 90,
          }),
        ]),
        expectedBalance: 1000,
      }),
    );
  });

  test('Should throw an error if the user does not exist', async () => {
    const { sut, userRepositoryStub } = makeSut();
    const createInvestmentDto = new CreateInvestmentDto();
    createInvestmentDto.owner_id = makeFakeUser().id;
    createInvestmentDto.name = 'Test Investment';
    createInvestmentDto.initial_value = 1000;
    createInvestmentDto.creation_date = new Date();

    jest
      .spyOn(userRepositoryStub, 'findOneOrFail')
      .mockRejectedValueOnce(new Error('User not found'));

    await expect(sut.execute(createInvestmentDto)).rejects.toThrowError(
      'User not found',
    );
  });

  test('Should throw an error if the investment already exists', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const createInvestmentDto = new CreateInvestmentDto();
    createInvestmentDto.owner_id = makeFakeUser().id;
    createInvestmentDto.name = 'Test Investment';
    createInvestmentDto.initial_value = 1000;
    createInvestmentDto.creation_date = new Date();

    const investment = new Investment();
    investment.id = makeFakeUser().id;
    investment.name = 'Test Investment';
    investment.initial_value = 1000;
    investment.creation_date = new Date();
    jest
      .spyOn(investmentRepositoryStub, 'getWithTransactions')
      .mockResolvedValueOnce(Promise.resolve(investment));

    await expect(sut.execute(createInvestmentDto)).rejects.toThrowError(
      `Investimento com ${createInvestmentDto.name} nome já existe, tente realizar uma transação!`,
    );
  });
});
