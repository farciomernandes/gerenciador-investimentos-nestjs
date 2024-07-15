import { CreateTransactionUseCase } from './create-transaction.usecase';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { Investment } from '@modules/investment/entities/investment.entity';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { makeInvestmentRepositoryStub } from '@modules/investment/mocks/investment.repository.mock';
import { TransactionRepositoryInterface } from '@modules/transaction/mocks/transaction.respository.interface';
import {
  makeTransactionMock,
  makeTransactionRepositoryStub,
} from '@modules/transaction/mocks/transaction.repository.mock';
import { TransactionTypes } from '@modules/transaction/enums/transaction';
import { ListTransactionDto } from '@modules/transaction/dtos/list-transaction.dto';

type SutTypes = {
  sut: CreateTransactionUseCase;
  transactionRepositoryStub: TransactionRepositoryInterface;
  investmentRepositoryStub: InvestmentRepositoryInterface;
};

const expectedResponse: ListTransactionDto = {
  totalPages: 1,
  transactions: [
    {
      amount: 100,
      id: 'valid-id',
      investment_id: 'valid-investment-id',
      net_amount: 81.5,
      tax: 18.5,
      transaction_date: new Date('2023-03-10T14:15:11.480Z'),
      type: 'INPUT',
    },
    {
      amount: 100,
      id: 'valid-id',
      investment_id: 'valid-investment-id',
      net_amount: 81.5,
      tax: 18.5,
      transaction_date: new Date('2023-03-10T14:15:11.480Z'),
      type: 'INPUT',
    },
  ],
};

const makeSut = (): SutTypes => {
  const transactionRepositoryStub = makeTransactionRepositoryStub();
  const investmentRepositoryStub = makeInvestmentRepositoryStub();

  const sut = new CreateTransactionUseCase(
    transactionRepositoryStub,
    investmentRepositoryStub,
  );
  return { sut, transactionRepositoryStub, investmentRepositoryStub };
};

describe('CreateTransactionUseCase', () => {
  test('Should create a new transaction', async () => {
    const { sut, transactionRepositoryStub, investmentRepositoryStub } =
      makeSut();
    const payload = {
      investment_id: 1,
      amount: 100,
      type: 'INPUT',
      transaction_date: new Date(),
    };

    const investment = new Investment();
    investment.id = 'valid_investment_id';
    investment.current_value = 0;

    jest
      .spyOn(investmentRepositoryStub, 'findOneOrFail')
      .mockResolvedValueOnce(Promise.resolve(investment));

    const transaction = new Transaction();
    transaction.id = 'valid_transaction_id';
    transaction.investment_id = 'valid_investment_id';
    transaction.amount = 100;
    transaction.type = TransactionTypes.INPUT;
    transaction.transaction_date = new Date();

    jest
      .spyOn(transactionRepositoryStub, 'create')
      .mockReturnValueOnce(transaction);
    jest
      .spyOn(transactionRepositoryStub, 'save')
      .mockResolvedValueOnce(Promise.resolve(transaction));

    const result = await sut.createTransaction(payload);
    expect(result).toEqual(transaction);
  });

  test('Should throw an error if the investment does not exist', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const payload = {
      investment_id: 1,
      amount: 100,
      type: 'INPUT',
      transaction_date: new Date(),
    };

    jest
      .spyOn(investmentRepositoryStub, 'findOneOrFail')
      .mockRejectedValueOnce(new Error('Investment not found'));

    await expect(sut.createTransaction(payload)).rejects.toThrowError(
      'Investment not found',
    );
  });

  test('Should throw an error if the withdrawal amount is greater than the investment value', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const payload = {
      investment_id: 1,
      amount: 100,
      type: 'OUTPUT',
      transaction_date: new Date(),
    };

    const investment = new Investment();
    investment.id = 'valid_investment_id';
    investment.current_value = 50;

    jest
      .spyOn(investmentRepositoryStub, 'findOneOrFail')
      .mockResolvedValueOnce(Promise.resolve(investment));

    await expect(sut.createTransaction(payload)).rejects.toThrowError(
      'O valor da retirada não pode ser maior que o valor atual do investimento',
    );
  });

  test('Should get all transactions', async () => {
    const { sut, transactionRepositoryStub } = makeSut();

    const transactions = [makeTransactionMock(), makeTransactionMock()];
    jest
      .spyOn(transactionRepositoryStub, 'find')
      .mockResolvedValueOnce(Promise.resolve(transactions));

    const result = await sut.getTransactions({ limit: 10, page: 1 });
    expect(result).toEqual(expectedResponse);
  });

  test('Should get tax rate', async () => {
    const { sut } = makeSut();

    const taxRate = 0.1;
    jest.spyOn(sut, 'getTaxRate').mockReturnValueOnce(taxRate);

    const result = await sut.getTaxRate(makeTransactionMock().transaction_date);
    expect(result).toBe(taxRate);
  });
});
