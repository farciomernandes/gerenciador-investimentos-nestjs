import { Injectable, NotFoundException } from '@nestjs/common';
import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { CreateTransactionDto } from '@modules/transaction/dtos/create-transaction.dto';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionProvider } from '@modules/transaction/providers/transaction.provider';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { TransactionInvestmentDto } from '@modules/investment/dtos/update-investment.dto';
import { ITransactionInvestmentUseCase } from './interfaces/transaction-investment.interface';

@Injectable()
export class TransactionInvestmentUseCase
  implements ITransactionInvestmentUseCase
{
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly transactionProvider: TransactionProvider,
  ) {}

  async execute(
    id: string,
    { amount }: TransactionInvestmentDto,
  ): Promise<Transaction> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    const monthsSinceCreation = InvestmentCalculations.getMonthsSinceCreation(
      investment.creation_date,
    );
    const currentValue = InvestmentCalculations.calculateCurrentValue(
      investment.current_value,
      INVESTMENT_RETURN_RATE,
      monthsSinceCreation,
    );

    if (amount > currentValue) {
      throw new Error(
        'Transaction value cannot be greater than current investment value',
      );
    }

    const taxRate = InvestmentCalculations.getTaxRate(investment.creation_date);
    const taxAmount = amount * taxRate;
    const netTransactionAmount = amount - taxAmount;

    investment.current_value -= amount;
    await this.investmentRepository.save(investment);

    const transaction: CreateTransactionDto = {
      investment_id: id,
      transaction_date: new Date(),
      amount: amount,
      type: 'OUTPUT',
      tax: taxAmount,
      net_amount: netTransactionAmount,
    };

    return this.transactionProvider.createTransaction(transaction);
  }
}
