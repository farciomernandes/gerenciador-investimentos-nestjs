import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Transaction } from '@modules/transaction/entities/transaction.entity';

@Injectable()
export class TransactionRepository extends Repository<Transaction> {
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
  ) {
    super(Transaction, dataSource.createEntityManager());
  }
}
