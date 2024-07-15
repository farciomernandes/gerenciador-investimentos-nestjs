import { Transaction } from '@modules/transaction/entities/transaction.entity';

export abstract class TransactionRepositoryInterface {
  abstract findAndCount(arg0: {
    skip: number;
    take: number;
  }): [any, any] | PromiseLike<[any, any]>;
  abstract findOne(options: any): Promise<any | null>;
  abstract create(Transaction: Partial<Transaction>): Transaction;
  abstract save(Transaction: Transaction): Promise<Transaction>;
  abstract find(options: any): Promise<Transaction[]>;
}
