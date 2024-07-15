import { Investment } from '../entities/investment.entity';

export abstract class InvestmentRepositoryInterface {
  abstract findOneOrFail(options: any): Promise<Investment>;
  abstract create(investment: Partial<Investment>): Investment;
  abstract save(investment: Investment): Promise<Investment>;
  abstract find(options: any): Promise<Investment[]>;
}
