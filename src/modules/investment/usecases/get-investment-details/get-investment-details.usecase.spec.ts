import { GetInvestmentDetailsUseCase } from './get-investment-details.usecase';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import {
  makeTransactionMock,
  makeTransactionRepositoryStub,
} from '@modules/transaction/mocks/transaction.repository.mock';
import { TransactionRepositoryInterface } from '@modules/transaction/mocks/transaction.respository.interface';

type SutTypes = {
  sut: GetInvestmentDetailsUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
  transactionRepositoryStub: TransactionRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const transactionRepositoryStub = makeTransactionRepositoryStub();
  const sut = new GetInvestmentDetailsUseCase(
    investmentRepositoryStub,
    transactionRepositoryStub,
  );
  return { sut, investmentRepositoryStub, transactionRepositoryStub };
};

describe('GetInvestmentDetailsUseCase', () => {
  test('Should return investment details', async () => {
    const { sut, investmentRepositoryStub, transactionRepositoryStub } =
      makeSut();
    const investmentId = 'valid-id';
    const investmentMock = makeInvestmentMock();
    const transactionMock = makeTransactionMock();

    jest
      .spyOn(investmentRepositoryStub, 'getWithTransactionsById')
      .mockResolvedValueOnce(Promise.resolve(investmentMock));

    jest
      .spyOn(transactionRepositoryStub, 'find')
      .mockResolvedValueOnce(Promise.resolve([transactionMock]));

    const result = await sut.execute(investmentId);

    expect(result).toEqual(
      expect.objectContaining({
        investment: expect.objectContaining({
          id: investmentMock.id,
          name: investmentMock.name,
          creation_date: investmentMock.creation_date,
          initial_value: investmentMock.initial_value,
          current_value: investmentMock.current_value,
          status: investmentMock.status,
        }),
        transactions: expect.arrayContaining([
          expect.objectContaining({
            id: transactionMock.id,
            investment_id: transactionMock.investment_id,
            transaction_date: transactionMock.transaction_date,
            amount: transactionMock.amount,
            type: transactionMock.type,
            tax: transactionMock.tax,
            net_amount: transactionMock.net_amount,
          }),
        ]),
        expectedBalance: expect.any(Number),
      }),
    );
  });

  test('Should throw NotFoundException if investment not found', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investmentId = 'invalid-id';

    jest
      .spyOn(investmentRepositoryStub, 'getWithTransactionsById')
      .mockResolvedValueOnce(Promise.resolve(null));

    await expect(sut.execute(investmentId)).rejects.toThrowError(
      `Investment with ID ${investmentId} not found`,
    );
  });

  test('Should throw NotFoundException if no transactions found', async () => {
    const { sut, investmentRepositoryStub, transactionRepositoryStub } =
      makeSut();
    const investmentId = 'valid-id';
    const investmentMock = makeInvestmentMock();

    jest
      .spyOn(investmentRepositoryStub, 'getWithTransactionsById')
      .mockResolvedValueOnce(Promise.resolve(investmentMock));

    jest
      .spyOn(transactionRepositoryStub, 'find')
      .mockResolvedValueOnce(Promise.resolve([]));

    await expect(sut.execute(investmentId)).rejects.toThrowError(
      `No transactions found for investment with ID ${investmentId}`,
    );
  });
});
