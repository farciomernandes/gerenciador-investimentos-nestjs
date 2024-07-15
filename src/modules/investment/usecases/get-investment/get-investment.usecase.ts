import { Investment } from '@modules/investment/entities/investment.entity';
import { Injectable } from '@nestjs/common';
import { IGetInvestmentUseCase } from './interfaces/get-investment.interface';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';

@Injectable()
export class GetInvestmentUseCase implements IGetInvestmentUseCase {
  constructor(
    private readonly investmentRepository: InvestmentRepositoryInterface,
  ) {}

  async execute(id: string): Promise<Investment | null> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });
    return investment;
  }
}
