import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { Injectable, NotFoundException } from '@nestjs/common';
import { IGetInvestmentDetailsUseCase } from './interface/get-investment-details.interface';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { ResponseInvestmentDetails } from '@modules/investment/dtos/response-investment-details.dto';
import { TransactionRepositoryInterface } from '@infra/typeorm/repositories/transaction.respository.interface';

@Injectable()
export class GetInvestmentDetailsUseCase
  implements IGetInvestmentDetailsUseCase
{
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly transactionRepository: TransactionRepositoryInterface,
  ) {}

  async execute(investment_id: string): Promise<ResponseInvestmentDetails> {
    const investment =
      await this.investmentRepository.getWithTransactionsById(investment_id);
    if (!investment) {
      throw new NotFoundException(
        `Investment with ID ${investment_id} not found`,
      );
    }

    const transactions = await this.transactionRepository.find({
      where: { investment_id: investment_id },
    });

    if (!transactions || transactions.length === 0) {
      throw new NotFoundException(
        `No transactions found for investment with ID ${investment_id}`,
      );
    }

    const expectedBalance = this.calculateExpectedBalance(transactions);

    return {
      investment: {
        id: investment.id,
        name: investment.name,
        creation_date: investment.creation_date,
        initial_value: Number(investment.initial_value),
        current_value: Number(investment.current_value),
        status: investment.status,
      },
      transactions: transactions.map((transaction) => ({
        id: transaction.id,
        investment_id: transaction.investment_id,
        transaction_date: transaction.transaction_date,
        amount: Number(transaction.amount),
        type: transaction.type,
        tax: Number(transaction.tax),
        net_amount: Number(transaction.net_amount),
      })),
      expectedBalance,
    };
  }

  private calculateExpectedBalance = (transactions: Transaction[]) => {
    return transactions.reduce((acc, transaction) => {
      if (transaction.type === 'OUTPUT') {
        return acc - transaction.amount;
      } else {
        return (
          acc +
          InvestmentCalculations.calculateCurrentValue(
            transaction.amount,
            INVESTMENT_RETURN_RATE,
            InvestmentCalculations.getMonthsSinceCreation(
              transaction.transaction_date,
            ),
          )
        );
      }
    }, 0);
  };
}
