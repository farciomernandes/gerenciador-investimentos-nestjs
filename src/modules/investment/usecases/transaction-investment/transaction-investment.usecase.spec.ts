import { TransactionInvestmentUseCase } from './transaction-investment.usecase';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { ICreateTransactionUseCase } from '@modules/transaction/usecases/create-transaction/interface/create-transaction.interface';
import { makeCreateTransactionUseCaseStub } from '@modules/transaction/mocks/create-transaction.usecase.mock';
import { makeTransactionMock } from '@modules/transaction/mocks/transaction.repository.mock';

type SutTypes = {
  sut: TransactionInvestmentUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
  createTransactionUseCaseStub: ICreateTransactionUseCase;
};

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const createTransactionUseCaseStub = makeCreateTransactionUseCaseStub();
  const sut = new TransactionInvestmentUseCase(
    investmentRepositoryStub,
    createTransactionUseCaseStub,
  );
  return {
    sut,
    investmentRepositoryStub,
    createTransactionUseCaseStub,
  };
};

describe('TransactionInvestmentUseCase', () => {
  test('Should throw NotFoundException when investment is not found', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    jest.spyOn(investmentRepositoryStub, 'findOne').mockResolvedValueOnce(null);
    await expect(sut.execute('invalid-id', { amount: 100 })).rejects.toThrow(
      NotFoundException,
    );
  });

  test('Should throw BadRequestException when transaction amount is greater than current value', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investment = makeInvestmentMock();
    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(investment);

    await expect(sut.execute(investment.id, { amount: 1200 })).rejects.toThrow(
      BadRequestException,
    );
  });

  test('Should create a new transaction and update investment current value', async () => {
    const { sut, investmentRepositoryStub, createTransactionUseCaseStub } =
      makeSut();
    const investment = makeInvestmentMock();
    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(investment);

    jest
      .spyOn(createTransactionUseCaseStub, 'createTransaction')
      .mockResolvedValueOnce(makeTransactionMock());

    const result = await sut.execute('valid-id', { amount: 100 });
    expect(result).toEqual(expect.objectContaining({ id: 'valid-id' }));
    expect(investment.current_value).toBe(900);
  });
});
