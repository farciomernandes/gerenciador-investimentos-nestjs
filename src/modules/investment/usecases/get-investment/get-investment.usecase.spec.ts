import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { GetInvestmentUseCase } from './get-investment.usecase';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';

type SutTypes = {
  sut: GetInvestmentUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const sut = new GetInvestmentUseCase(investmentRepositoryStub);
  return { sut, investmentRepositoryStub };
};

describe('GetInvestmentUseCase', () => {
  test('Should return an investment by id', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investmentId = 'valid-id';
    const investmentMock = makeInvestmentMock();

    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(investmentMock));

    const result = await sut.execute(investmentId);

    expect(result).toEqual(investmentMock);
  });

  test('Should return null if investment not found', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investmentId = 'invalid-id';

    jest
      .spyOn(investmentRepositoryStub, 'findOne')
      .mockResolvedValueOnce(Promise.resolve(null));

    const result = await sut.execute(investmentId);

    expect(result).toBeNull();
  });
});
