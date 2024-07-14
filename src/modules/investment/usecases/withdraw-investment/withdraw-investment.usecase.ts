import { Injectable, NotFoundException } from '@nestjs/common';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';
import { CreateWithdrawalDto } from '@modules/withdrawal/dtos/create-withdrawal.dto';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { WithdrawalProvider } from '@modules/withdrawal/providers/wihdrawal.provider';
import { IWithdrawInvestmentUseCase } from './interfaces/withdraw-investment.interface';

@Injectable()
export class WithdrawInvestmentUseCase implements IWithdrawInvestmentUseCase {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly withdrawalProvider: WithdrawalProvider,
  ) {}

  async execute(id: string): Promise<Withdrawal> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    const months_since_creation = this.getMonthsSinceCreation(
      investment.creation_date,
    );
    const interest_rate = 0.0052;
    const current_value =
      investment.current_value *
      Math.pow(1 + interest_rate, months_since_creation);

    const tax_rate = this.getTaxRate(investment.creation_date);
    const tax_amount = current_value * tax_rate;
    const withdrawal_amount = current_value - tax_amount;

    investment.current_value = 0;
    await this.investmentRepository.save(investment);

    const withdrawal: CreateWithdrawalDto = {
      investment_id: id,
      withdrawal_date: new Date(),
      amount: current_value,
      tax: tax_amount,
      net_amount: withdrawal_amount,
    };

    return this.withdrawalProvider.createWithdrawal(withdrawal);
  }

  getMonthsSinceCreation(createAt: Date): number {
    const today = new Date();
    const months =
      (today.getFullYear() - createAt.getFullYear()) * 12 +
      today.getMonth() -
      createAt.getMonth();
    return months;
  }

  getTaxRate(createAt: Date): number {
    const age = this.getAge(createAt);
    if (age < 1) {
      return 0.225;
    } else if (age < 2) {
      return 0.185;
    } else {
      return 0.15;
    }
  }

  getAge(createAt: Date): number {
    const today = new Date();
    let ageInYears = today.getFullYear() - createAt.getFullYear();
    const isBeforeBirthdayThisYear =
      today.getMonth() < createAt.getMonth() ||
      (today.getMonth() === createAt.getMonth() &&
        today.getDate() < createAt.getDate());

    if (isBeforeBirthdayThisYear) {
      ageInYears--;
    }
    return ageInYears;
  }
}
