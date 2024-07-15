import { UpdateInvestmentUseCase } from './update-investment.usecase';
import { UpdateInvestmentDto } from '../../dtos/update-investment.dto';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { TransactionRepositoryInterface } from '@modules/transaction/mocks/transaction.respository.interface';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';
import {
  makeTransactionMock,
  makeTransactionRepositoryStub,
} from '@modules/transaction/mocks/transaction.repository.mock';
import { TransactionTypes } from '@modules/transaction/enums/transaction';

type SutTypes = {
  sut: UpdateInvestmentUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
  transactionRepositoryStub: TransactionRepositoryInterface;
};

const invalid_id = 'invalid_id';

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const transactionRepositoryStub = makeTransactionRepositoryStub();
  const sut = new UpdateInvestmentUseCase(
    investmentRepositoryStub,
    transactionRepositoryStub,
  );
  return {
    sut,
    investmentRepositoryStub,
    transactionRepositoryStub,
  };
};

describe('UpdateInvestmentUseCase', () => {
  test('Should update an investment', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const updateInvestmentDto = new UpdateInvestmentDto();
    updateInvestmentDto.amount = 100;
    updateInvestmentDto.type = TransactionTypes.INPUT;

    const investment = makeInvestmentMock();
    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(investment));

    const updatedInvestment = { ...investment, current_value: 1100 };
    jest
      .spyOn(investmentRepositoryStub, 'save')
      .mockResolvedValueOnce(Promise.resolve(updatedInvestment));

    const result = await sut.execute(updateInvestmentDto, 'valid-id');

    expect(result).toEqual(updatedInvestment);
  });

  test('Should throw an error if the investment does not exist', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const updateInvestmentDto = new UpdateInvestmentDto();
    updateInvestmentDto.amount = 100;
    updateInvestmentDto.type = TransactionTypes.INPUT;

    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(null));

    await expect(
      sut.execute(updateInvestmentDto, invalid_id),
    ).rejects.toThrowError(`Investment with ID ${invalid_id} not found`);
  });

  test('Should throw an error if the amount is invalid', async () => {
    const { sut } = makeSut();
    const updateInvestmentDto = new UpdateInvestmentDto();
    // @ts-ignore
    updateInvestmentDto.amount = 'invalid-amount';
    updateInvestmentDto.type = TransactionTypes.INPUT;

    await expect(
      sut.execute(updateInvestmentDto, 'valid-id'),
    ).rejects.toThrowError('O valor informado está em um formato inválido');
  });

  test('Should throw an error if the withdrawal amount is greater than the current value', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const updateInvestmentDto = new UpdateInvestmentDto();
    updateInvestmentDto.amount = 1500;
    updateInvestmentDto.type = TransactionTypes.OUTPUT;

    const investment = makeInvestmentMock();
    investment.current_value = 1000;
    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(investment));

    await expect(
      sut.execute(updateInvestmentDto, 'valid-id'),
    ).rejects.toThrowError(
      'O valor da retirada não pode ser maior que o valor atual do investimento',
    );
  });

  test('Should create a transaction and update the investment value on withdrawal', async () => {
    const { sut, transactionRepositoryStub, investmentRepositoryStub } =
      makeSut();
    const updateInvestmentDto = new UpdateInvestmentDto();
    updateInvestmentDto.amount = 500;
    updateInvestmentDto.type = TransactionTypes.OUTPUT;

    const investment = makeInvestmentMock();
    investment.current_value = 1000;
    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(investment));

    const taxRate = 0.1;
    const taxAmount = updateInvestmentDto.amount * taxRate;
    const netWithdrawalAmount = updateInvestmentDto.amount - taxAmount;
    const updatedValue = investment.current_value - netWithdrawalAmount;
    const transaction = makeTransactionMock();

    jest
      .spyOn(transactionRepositoryStub, 'create')
      .mockReturnValueOnce(transaction);
    jest
      .spyOn(transactionRepositoryStub, 'save')
      .mockResolvedValueOnce(Promise.resolve(transaction));

    jest.spyOn(investmentRepositoryStub, 'save').mockResolvedValueOnce(
      Promise.resolve({
        ...makeInvestmentMock(),
        current_value: updatedValue,
      }),
    );

    const result = await sut.execute(updateInvestmentDto, 'valid-id');

    expect(result.current_value).toBe(updatedValue);
    expect(transactionRepositoryStub.create).toHaveBeenCalledTimes(1);
    expect(transactionRepositoryStub.save).toHaveBeenCalledTimes(1);
  });
});
