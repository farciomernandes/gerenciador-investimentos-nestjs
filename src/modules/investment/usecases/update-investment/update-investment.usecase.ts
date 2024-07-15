import { BadRequestException, Injectable } from '@nestjs/common';
import { Investment } from '../../entities/investment.entity';
import { UpdateInvestmentDto } from '../../dtos/update-investment.dto';
import { IUpdateInvestmentUseCase } from './interfaces/update-investment.interface';
import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { TransactionTypes } from '@modules/transaction/enums/transaction';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';
import { TransactionRepositoryInterface } from '@modules/transaction/mocks/transaction.respository.interface';

@Injectable()
export class UpdateInvestmentUseCase implements IUpdateInvestmentUseCase {
  constructor(
    private readonly investmentRepository: InvestmentRepositoryInterface,
    private readonly transactionRepository: TransactionRepositoryInterface,
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
      throw new BadRequestException(
        'O valor informado está em um formato inválido',
      );
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
    if (payload.type === TransactionTypes.INPUT) {
      updatedValue = currentValue + amount;
    } else {
      if (amount > currentValue) {
        throw new BadRequestException(
          'O valor da retirada não pode ser maior que o valor atual do investimento',
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
        'A atualização do investimento resultaria em valor final negativo',
      );
    }

    investment.current_value = updatedValue;

    return this.investmentRepository.save(investment);
  }
}
