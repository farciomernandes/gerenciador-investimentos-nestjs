import { GetInvestmentsWithStatusUseCase } from './get-investments-with-status.usecase';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { Investment } from '@modules/investment/entities/investment.entity';
import { BadRequestException } from '@nestjs/common';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';

type SutTypes = {
  sut: GetInvestmentsWithStatusUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const sut = new GetInvestmentsWithStatusUseCase(investmentRepositoryStub);
  return {
    sut,
    investmentRepositoryStub,
  };
};

describe('GetInvestmentsWithStatusUseCase', () => {
  test('Should throw BadRequestException when invalid status is provided', async () => {
    const { sut } = makeSut();
    const invalidStatus = 'NOT_A_VALID_STATUS';
    await expect(sut.execute(1, 10, invalidStatus)).rejects.toThrow(
      BadRequestException,
    );
  });

  test('Should return investments with valid status', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investments: Investment[] = [
      makeInvestmentMock(),
      makeInvestmentMock(),
    ];
    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValue([investments, 2]);

    const result = await sut.execute(1, 10, InvestmentStatus.ACTIVE);
    expect(result.investments).toHaveLength(2);
    expect(result.totalPages).toBe(1);
  });

  test('Should return investments without status filter', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investments: Investment[] = [
      makeInvestmentMock(),
      {
        ...makeInvestmentMock(),
        id: 'valid-2',
        status: InvestmentStatus.SUSPENDED,
      },
    ];
    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValue([investments, 2]);

    const result = await sut.execute(1, 10);
    expect(result.investments).toHaveLength(2);
    expect(result.totalPages).toBe(1);
  });

  test('Should return paginated investments', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const investments: Investment[] = [
      makeInvestmentMock(),
      { ...makeInvestmentMock(), id: 'valid-2' },
      { ...makeInvestmentMock(), id: 'valid-3' },
      { ...makeInvestmentMock(), id: 'valid-4' },
    ];
    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValue([investments.slice(0, 2), 4]);

    const result = await sut.execute(1, 2, InvestmentStatus.ACTIVE);
    expect(result.investments).toHaveLength(2);
    expect(result.totalPages).toBe(2);
  });
});
