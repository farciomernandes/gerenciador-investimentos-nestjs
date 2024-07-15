import { PaginationFilter } from 'src/shared/filter/pagination.filter';
import { ListTransactionDto } from '@modules/transaction/dtos/list-transaction.dto';

export abstract class ICreateTransactionUseCase {
  abstract createTransaction(payload: any): Promise<any>;

  abstract getTransactions(
    queryParams: PaginationFilter,
  ): Promise<ListTransactionDto>;

  abstract getTaxRate(transactionDate: Date): number;

  abstract getAgeInYears(transactionDate: Date): number;
}
