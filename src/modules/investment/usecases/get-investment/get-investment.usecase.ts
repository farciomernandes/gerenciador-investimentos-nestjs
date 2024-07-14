import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { Investment } from '@modules/investment/entities/investment.entity';
import { Injectable } from '@nestjs/common';
import { IGetInvestmentUseCase } from './interfaces/get-investment.interface';

@Injectable()
export class GetInvestmentUseCase implements IGetInvestmentUseCase {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async execute(id: string): Promise<Investment | null> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });
    return investment;
  }
}
