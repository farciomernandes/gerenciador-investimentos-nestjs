import { CreateInvestmentDto } from '@modules/investment/dtos/create-investment.dto';
import { Investment } from '@modules/investment/entities/investment.entity';

export abstract class ICreateInvestmentUseCase {
  abstract execute(
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<Investment>;
}
