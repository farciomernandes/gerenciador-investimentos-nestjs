/* eslint-disable @typescript-eslint/no-unused-vars */
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { TransactionRepositoryInterface } from './transaction.respository.interface';
import { TransactionTypes } from '../enums/transaction';
import { makeInvestmentMock } from '@modules/investment/mocks/investment.repository.mock';

export const makeTransactionMock = (): Transaction => ({
  id: 'valid-id',
  investment_id: 'valid-investment-id',
  amount: 100,
  type: TransactionTypes.INPUT,
  transaction_date: new Date('2023-03-10T11:15:11.48'),
  tax: 0.1,
  net_amount: 90,
  investment: makeInvestmentMock(),
  created_at: new Date('2023-03-10T11:15:11.48'),
  updated_at: new Date(Date.now()),
  deleted_at: new Date(Date.now()),
});

export const makeTransactionRepositoryStub =
  (): TransactionRepositoryInterface => {
    class TransactionRepositoryStub implements TransactionRepositoryInterface {
      async findOne(options: any): Promise<Transaction | null> {
        return Promise.resolve(makeTransactionMock());
      }
      async find(options: any): Promise<Transaction[]> {
        const transactions = [makeTransactionMock(), makeTransactionMock()];
        return Promise.resolve(transactions);
      }
      create(_transaction: Partial<Transaction>): Transaction {
        return makeTransactionMock();
      }
      async save(_transaction: Transaction): Promise<Transaction> {
        return Promise.resolve(makeTransactionMock());
      }
      async findAndCount(_options: any): Promise<[Transaction[], number]> {
        const transactions = [makeTransactionMock(), makeTransactionMock()];
        const count = 2;
        return Promise.resolve([transactions, count]);
      }
    }

    return new TransactionRepositoryStub();
  };
