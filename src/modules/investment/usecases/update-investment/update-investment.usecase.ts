import { BadRequestException, Injectable } from '@nestjs/common';
import { Investment } from '../../entities/investment.entity';
import { UpdateInvestmentDto } from '../../dtos/update-investment.dto';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';

@Injectable()
export class UpdateInvestmentUseCase {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async execute(payload: UpdateInvestmentDto, id: string): Promise<Investment> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });
    if (!investment) {
      throw new BadRequestException(`Investment with ID ${id} not found`);
    }

    const amount = Number(payload.amount);
    if (isNaN(amount)) {
      throw new BadRequestException('Invalid amount provided');
    }

    const updatedValue = this.calculateUpdatedValue(investment, payload);
    if (updatedValue < 0) {
      throw new BadRequestException(
        'Investment update would result in negative current_value',
      );
    }

    investment.current_value = updatedValue;
    return this.investmentRepository.save(investment);
  }

  private calculateUpdatedValue(
    investment: Investment,
    payload: UpdateInvestmentDto,
  ): number {
    const amount = Number(payload.amount);
    if (payload.type === 'input') {
      return Number(investment.current_value) + amount;
    } else {
      return Number(investment.current_value) - amount;
    }
  }
}
