import { UpdateInvestmentDto } from '@modules/investment/dtos/update-investment.dto';
import { Investment } from '@modules/investment/entities/investment.entity';

export abstract class IUpdateInvestmentUseCase {
  abstract execute(
    payload: UpdateInvestmentDto,
    id: string,
  ): Promise<Investment>;
}
