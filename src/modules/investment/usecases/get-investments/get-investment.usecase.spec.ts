import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { GetInvestmentsUseCase } from './get-investments.usecase';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';

type SutTypes = {
  sut: GetInvestmentsUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const sut = new GetInvestmentsUseCase(investmentRepositoryStub);
  return { sut, investmentRepositoryStub };
};

describe('GetInvestmentsUseCase', () => {
  test('Should return investments with default pagination', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investmentsMock = [makeInvestmentMock(), makeInvestmentMock()];
    const total = 20;

    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValueOnce(Promise.resolve([investmentsMock, total]));

    const result = await sut.execute();

    expect(result).toEqual(
      expect.objectContaining({
        investments: expect.arrayContaining([
          expect.objectContaining({
            id: investmentsMock[0].id,
            name: investmentsMock[0].name,
            creation_date: investmentsMock[0].creation_date,
            initial_value: investmentsMock[0].initial_value,
            current_value: investmentsMock[0].current_value,
            status: investmentsMock[0].status,
          }),
          expect.objectContaining({
            id: investmentsMock[1].id,
            name: investmentsMock[1].name,
            creation_date: investmentsMock[1].creation_date,
            initial_value: investmentsMock[1].initial_value,
            current_value: investmentsMock[1].current_value,
            status: investmentsMock[1].status,
          }),
        ]),
        totalPages: 2,
      }),
    );
  });

  test('Should return investments with custom pagination', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investmentsMock = [makeInvestmentMock(), makeInvestmentMock()];
    const total = 20;

    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValueOnce(Promise.resolve([investmentsMock, total]));

    const result = await sut.execute(2, 5);

    expect(result).toEqual(
      expect.objectContaining({
        investments: expect.arrayContaining([
          expect.objectContaining({
            id: investmentsMock[0].id,
            name: investmentsMock[0].name,
            creation_date: investmentsMock[0].creation_date,
            initial_value: investmentsMock[0].initial_value,
            current_value: investmentsMock[0].current_value,
            status: investmentsMock[0].status,
          }),
          expect.objectContaining({
            id: investmentsMock[1].id,
            name: investmentsMock[1].name,
            creation_date: investmentsMock[1].creation_date,
            initial_value: investmentsMock[1].initial_value,
            current_value: investmentsMock[1].current_value,
            status: investmentsMock[1].status,
          }),
        ]),
        totalPages: 4,
      }),
    );
  });

  test('Should return investments with filter by status', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investmentsMock = [makeInvestmentMock()];
    const total = 10;

    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValueOnce(Promise.resolve([investmentsMock, total]));

    const result = await sut.execute(1, 10, 'ACTIVE');

    expect(result).toEqual(
      expect.objectContaining({
        investments: expect.arrayContaining([
          expect.objectContaining({
            id: investmentsMock[0].id,
            name: investmentsMock[0].name,
            creation_date: investmentsMock[0].creation_date,
            initial_value: investmentsMock[0].initial_value,
            current_value: investmentsMock[0].current_value,
            status: 'ACTIVE',
          }),
        ]),
        totalPages: 1,
      }),
    );
  });
});
