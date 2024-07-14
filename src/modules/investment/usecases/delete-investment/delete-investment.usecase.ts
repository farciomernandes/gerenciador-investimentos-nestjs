import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IDeleteInvestmentUseCase } from './interfaces/delete-investment.interface';

@Injectable()
export class DeleteInvestmentUseCase implements IDeleteInvestmentUseCase {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async execute(id: string): Promise<void> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });

    if (!investment) {
      throw new BadRequestException(`Invesment not found`);
    }

    await this.investmentRepository.delete(investment);
  }
}
