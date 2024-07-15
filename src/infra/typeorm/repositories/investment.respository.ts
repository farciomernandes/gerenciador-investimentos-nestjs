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

  async getWithTransactions(name: string, owner_id: string): Promise<any> {
    const investment = await this.createQueryBuilder('investment')
      .innerJoinAndSelect('investment.transactions', 'transactions')
      .innerJoinAndSelect('investment.owner', 'owner')
      .where('investment.name = :name AND investment.owner_id = :owner_id', {
        name,
        owner_id,
      })
      .getOne();

    return investment;
  }
  async getWithTransactionsById(id: string): Promise<any> {
    const investment = await this.createQueryBuilder('investment')
      .innerJoinAndSelect('investment.transactions', 'transactions')
      .innerJoinAndSelect('investment.owner', 'owner')
      .where('investment.id = :id ', { id })
      .getOne();

    return investment;
  }
}
