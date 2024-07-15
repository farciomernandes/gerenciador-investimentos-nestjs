import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { TransactionRepositoryInterface } from '../../../modules/transaction/mocks/transaction.respository.interface';

@Injectable()
export class TransactionRepository
  extends Repository<Transaction>
  implements TransactionRepositoryInterface
{
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
  ) {
    super(Transaction, dataSource.createEntityManager());
  }
}
