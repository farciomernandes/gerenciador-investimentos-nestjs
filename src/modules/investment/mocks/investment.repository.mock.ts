/* eslint-disable @typescript-eslint/no-unused-vars */
import { Investment } from '@modules/investment/entities/investment.entity';
import { InvestmentRepositoryInterface } from './investment.respository.interface';
import { InvestmentStatus } from '../enums/investments';
import { makeFakeUser } from '@modules/auth/mocks/user.repository.mock';

export const makeInvestmentMock = (): Investment => ({
  id: 'valid-id',
  creation_date: new Date(Date.now()),
  initial_value: 1000,
  current_value: 1000,
  name: 'Any Investment',
  owner_id: 'valid-owner-id',
  status: InvestmentStatus.ACTIVE,
  transactions: [],
  created_at: new Date(Date.now()),
  updated_at: new Date(Date.now()),
  deleted_at: new Date(Date.now()),
  owner: makeFakeUser(),
});

export const makeInvestmentRepositoryStub =
  (): InvestmentRepositoryInterface => {
    class InvestmentRepositoryStub implements InvestmentRepositoryInterface {
      async findOneOrFail(_where: any): Promise<Investment> {
        return Promise.resolve(makeInvestmentMock());
      }

      create(_investment: Partial<Investment>): Investment {
        return makeInvestmentMock();
      }
      async save(_investment: Investment): Promise<Investment> {
        return Promise.resolve(makeInvestmentMock());
      }
      async find(_options: any): Promise<Investment[]> {
        const investments = [makeInvestmentMock(), makeInvestmentMock()];
        return Promise.resolve(investments);
      }
    }

    return new InvestmentRepositoryStub();
  };
