/* eslint-disable @typescript-eslint/no-unused-vars */
import { Investment } from '@modules/investment/entities/investment.entity';
import { InvestmentRepositoryInterface } from './investment.respository.interface';
import { InvestmentStatus } from '../enums/investments';
import { makeFakeUser } from '@modules/auth/mocks/user.repository.mock';
import { makeTransactionMock } from '@modules/transaction/mocks/transaction.repository.mock';

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

const makeFakeInvestmentWithTransaction = () => ({
  created_at: makeInvestmentMock().created_at,
  updated_at: makeInvestmentMock().updated_at,
  deleted_at: makeInvestmentMock().deleted_at,
  id: makeInvestmentMock().id,
  owner_id: makeInvestmentMock().owner_id,
  name: makeInvestmentMock().name,
  creation_date: makeInvestmentMock().creation_date,
  initial_value: makeInvestmentMock().initial_value,
  current_value: makeInvestmentMock().current_value,
  status: 'IN_PROGRESS',
  transactions: [
    {
      created_at: makeTransactionMock().created_at,
      updated_at: makeTransactionMock().updated_at,
      deleted_at: makeTransactionMock().deleted_at,
      id: makeTransactionMock().id,
      investment_id: makeTransactionMock().investment_id,
      transaction_date: makeTransactionMock().transaction_date,
      amount: makeTransactionMock().amount,
      type: makeTransactionMock().type,
      tax: makeTransactionMock().tax,
      net_amount: makeTransactionMock().net_amount,
    },
  ],
  owner: {
    created_at: makeInvestmentMock().owner.created_at,
    updated_at: makeInvestmentMock().owner.updated_at,
    deleted_at: makeInvestmentMock().owner.deleted_at,
    id: makeInvestmentMock().owner.id,
    name: makeInvestmentMock().owner.name,
    email: makeInvestmentMock().owner.email,
    password: makeInvestmentMock().owner.password,
  },
});

export const makeInvestmentRepositoryStub =
  (): InvestmentRepositoryInterface => {
    class InvestmentRepositoryStub implements InvestmentRepositoryInterface {
      async getWithTransactions(name: string, owner_id: string): Promise<any> {
        return Promise.resolve(makeFakeInvestmentWithTransaction());
      }
      async getWithTransactionsById(id: string): Promise<any> {
        throw new Error('Method not implemented.');
      }
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
