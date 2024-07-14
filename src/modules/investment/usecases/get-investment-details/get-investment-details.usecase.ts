import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IGetInvestmentDetailsUseCase } from './interface/get-investment-details.interface';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';

@Injectable()
export class GetInvestmentDetailsUseCase
  implements IGetInvestmentDetailsUseCase
{
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(investment_id: string): Promise<any> {
    const investment = await this.investmentRepository.findOne({
      where: { id: investment_id },
    });
    if (!investment) {
      throw new NotFoundException(
        `Investment with ID ${investment_id} not found`,
      );
    }

    const transactions = await this.transactionRepository.find({
      where: { investment_id: investment_id },
    });
    const expectedBalance = InvestmentCalculations.calculateCurrentValue(
      investment.initial_value,
      INVESTMENT_RETURN_RATE,
      InvestmentCalculations.getMonthsSinceCreation(investment.creation_date),
    );

    return {
      investment: {
        id: investment.id,
        name: investment.name,
        creation_date: investment.creation_date,
        initial_value: investment.initial_value,
        current_value: investment.current_value,
        status: investment.status,
      },
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        investment_id: transaction.investment_id,
        transaction_date: transaction.transaction_date,
        amount: transaction.amount,
        type: transaction.type,
        tax: transaction.tax,
        net_amount: transaction.net_amount,
      })),
      expectedBalance,
    };
  }
}
