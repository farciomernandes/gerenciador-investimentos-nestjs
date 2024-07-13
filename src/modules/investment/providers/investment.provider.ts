import { Injectable } from '@nestjs/common';
import { Investment } from '../entities/investment.entity';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';

@Injectable()
export class InvestmentProvider {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async create(investment: Investment): Promise<Investment> {
    return this.investmentRepository.save(investment);
  }

  async findAll(): Promise<Investment[]> {
    return this.investmentRepository.find();
  }
}
