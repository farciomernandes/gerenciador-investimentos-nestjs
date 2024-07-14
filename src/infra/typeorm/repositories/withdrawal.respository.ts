import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';

@Injectable()
export class WithdrawalRepository extends Repository<Withdrawal> {
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
  ) {
    super(Withdrawal, dataSource.createEntityManager());
  }
}
