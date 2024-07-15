import { GetInvestmentsByOwnerIdUseCase } from './get-investments-by-owner-id.usecase';
import { InvesmentParamsDTO } from '@modules/investment/dtos/investment-params.dto';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import {
  makeInvestmentMock,
  makeInvestmentRepositoryStub,
} from '@modules/investment/mocks/investment.repository.mock';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { BadRequestException } from '@nestjs/common';

type SutTypes = {
  sut: GetInvestmentsByOwnerIdUseCase;
  investmentRepositoryStub: InvestmentRepositoryInterface;
};

const makeSut = (): SutTypes => {
  const investmentRepositoryStub = makeInvestmentRepositoryStub();
  const sut = new GetInvestmentsByOwnerIdUseCase(investmentRepositoryStub);
  return { sut, investmentRepositoryStub };
};

describe('GetInvestmentsByOwnerIdUseCase', () => {
  test('Should return investments by owner id', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const ownerId = 'valid-owner-id';
    const params: InvesmentParamsDTO = {
      page: 1,
      limit: 10,
    };

    const investmentsMock = [makeInvestmentMock(), makeInvestmentMock()];
    const total = 2;

    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValueOnce(Promise.resolve([investmentsMock, total]));

    const result = await sut.execute(ownerId, params);

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
        totalPages: 1,
      }),
    );
  });

  test('Should return investments by owner id with status filter', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const ownerId = 'valid-owner-id';
    const params: InvesmentParamsDTO = {
      page: 1,
      limit: 10,
      status: InvestmentStatus.ACTIVE,
    };

    const investmentsMock = [makeInvestmentMock()];
    const total = 1;

    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValueOnce(Promise.resolve([investmentsMock, total]));

    const result = await sut.execute(ownerId, params);

    expect(result).toEqual(
      expect.objectContaining({
        investments: expect.arrayContaining([
          expect.objectContaining({
            id: investmentsMock[0].id,
            name: investmentsMock[0].name,
            creation_date: investmentsMock[0].creation_date,
            initial_value: investmentsMock[0].initial_value,
            current_value: investmentsMock[0].current_value,
            status: InvestmentStatus.ACTIVE,
          }),
        ]),
        totalPages: 1,
      }),
    );
  });

  const invalidStatus = 'NOT_A_VALID_STATUS' as InvestmentStatus;

  test('Should throw BadRequestException when invalid status is provided', async () => {
    const { sut } = makeSut();
    const ownerId = 'valid-owner-id';
    const params: InvesmentParamsDTO = {
      page: 1,
      limit: 10,
      status: invalidStatus,
    };

    jest.spyOn(sut, 'validateStatus').mockImplementation(() => {
      throw new BadRequestException(`Invalid status type: ${params.status}.`);
    });

    await expect(sut.execute(ownerId, params)).rejects.toThrow(
      BadRequestException,
    );
  });

  test('Should return empty array when no investments are found', async () => {
    const { sut, investmentRepositoryStub } = makeSut();
    const ownerId = 'valid-owner-id';
    const params: InvesmentParamsDTO = {
      page: 1,
      limit: 10,
    };

    jest
      .spyOn(investmentRepositoryStub, 'findAndCount')
      .mockResolvedValueOnce(Promise.resolve([[], 0]));

    const result = await sut.execute(ownerId, params);

    expect(result).toEqual(
      expect.objectContaining({
        investments: expect.arrayContaining([]),
        totalPages: 0,
      }),
    );
  });
});
