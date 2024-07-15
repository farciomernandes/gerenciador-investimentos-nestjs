/* eslint-disable @typescript-eslint/no-unused-vars */
import { PaginationFilter } from 'src/shared/filter/pagination.filter';
import { ICreateTransactionUseCase } from '../usecases/create-transaction/interface/create-transaction.interface';
import { ListTransactionDto } from '../dtos/list-transaction.dto';
import { Transaction } from '../entities/transaction.entity';
import { makeTransactionMock } from './transaction.repository.mock';
import { BadRequestException } from '@nestjs/common';

export const makeCreateTransactionUseCaseStub =
  (): ICreateTransactionUseCase => {
    class CreateTransactionUseCaseStub implements ICreateTransactionUseCase {
      async createTransaction(payload: any): Promise<Transaction> {
        if (payload.amount > 1000) {
          return Promise.reject(
            new BadRequestException(
              'O valor da transação não pode ser maior que o valor atual do investimento após a aplicação da taxa de juros',
            ),
          );
        }
        return Promise.resolve(makeTransactionMock());
      }

      async getTransactions(
        _queryParams: PaginationFilter,
      ): Promise<ListTransactionDto> {
        const transactions = [makeTransactionMock(), makeTransactionMock()];
        const totalPages = 1;
        return Promise.resolve({ transactions, totalPages });
      }

      getTaxRate(_transactionDate: Date): number {
        return 0.1;
      }

      getAgeInYears(_transactionDate: Date): number {
        return 1;
      }
    }

    return new CreateTransactionUseCaseStub();
  };
