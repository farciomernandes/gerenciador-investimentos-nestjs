import { DataSource, Repository } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Investment } from '@modules/investment/entities/investment.entity';

@Injectable()
export class InvestmentRepository extends Repository<Investment> {
  constructor(
    @InjectDataSource()
    readonly dataSource: DataSource,
  ) {
    super(Investment, dataSource.createEntityManager());
  }
}
