import { Investment } from '@modules/investment/entities/investment.entity';

export abstract class IGetInvestmentUseCase {
  abstract execute(id: string): Promise<Investment | null>;
}
