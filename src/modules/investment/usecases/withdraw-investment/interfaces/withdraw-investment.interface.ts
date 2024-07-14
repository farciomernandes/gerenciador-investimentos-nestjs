import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';

export abstract class IWithdrawInvestmentUseCase {
  abstract execute(id: string): Promise<Withdrawal>;
  abstract getAge(createAt: Date): number;
  abstract getMonthsSinceCreation(createAt: Date): number;
  abstract getTaxRate(createAt: Date): number;
}
