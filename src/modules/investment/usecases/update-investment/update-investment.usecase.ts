import { BadRequestException, Injectable } from '@nestjs/common';
import { Investment } from '../../entities/investment.entity';
import { UpdateInvestmentDto } from '../../dtos/update-investment.dto';
import { IUpdateInvestmentUseCase } from './interfaces/update-investment.interface';
import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { TransactionTypes } from '@modules/transaction/enums/transaction';

@Injectable()
export class UpdateInvestmentUseCase implements IUpdateInvestmentUseCase {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

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

    const monthsSinceCreation = InvestmentCalculations.getMonthsSinceCreation(
      investment.creation_date,
    );
    const currentValue = InvestmentCalculations.calculateCurrentValue(
      investment.current_value,
      INVESTMENT_RETURN_RATE,
      monthsSinceCreation,
    );

    let updatedValue;
    if (payload.type === 'input') {
      updatedValue = currentValue + amount;
    } else {
      if (amount > currentValue) {
        throw new BadRequestException(
          'Withdrawal amount cannot be greater than current investment value',
        );
      }
      const taxRate = InvestmentCalculations.getTaxRate(
        investment.creation_date,
      );
      const taxAmount = amount * taxRate;
      const netWithdrawalAmount = amount - taxAmount;
      updatedValue = currentValue - netWithdrawalAmount;

      const transaction: Transaction = this.transactionRepository.create({
        investment_id: id,
        transaction_date: new Date(),
        amount,
        type: TransactionTypes.OUTPUT,
        tax: taxAmount,
        net_amount: netWithdrawalAmount,
      });
      await this.transactionRepository.save(transaction);
    }

    if (updatedValue < 0) {
      throw new BadRequestException(
        'Investment update would result in negative current_value',
      );
    }

    investment.current_value = updatedValue;

    return this.investmentRepository.save(investment);
  }
}
