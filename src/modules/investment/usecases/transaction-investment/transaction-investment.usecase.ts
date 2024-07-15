import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { CreateTransactionDto } from '@modules/transaction/dtos/create-transaction.dto';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { TransactionInvestmentDto } from '@modules/investment/dtos/update-investment.dto';
import { ITransactionInvestmentUseCase } from './interfaces/transaction-investment.interface';
import { ICreateTransactionUseCase } from '@modules/transaction/usecases/create-transaction/interface/create-transaction.interface';

@Injectable()
export class TransactionInvestmentUseCase
  implements ITransactionInvestmentUseCase
{
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly createTransactionUseCase: ICreateTransactionUseCase,
  ) {}

  async execute(
    id: string,
    { amount }: TransactionInvestmentDto,
    type: string = 'INPUT',
  ): Promise<Transaction> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });

    if (!investment) {
      throw new NotFoundException(`Investmento não encontrado`);
    }

    const monthsSinceCreation = InvestmentCalculations.getMonthsSinceCreation(
      investment.creation_date,
    );

    const currentValue = InvestmentCalculations.calculateCurrentValue(
      amount,
      INVESTMENT_RETURN_RATE,
      monthsSinceCreation,
    );

    if (amount > currentValue) {
      throw new BadRequestException(
        'O valor da transação não pode ser maior que o valor atual do investimento',
      );
    }

    const taxRate = InvestmentCalculations.getTaxRate(investment.creation_date);
    const taxAmount = amount * taxRate;
    const netTransactionAmount = amount - taxAmount;

    investment.current_value = investment.current_value - amount;

    const transaction: CreateTransactionDto = {
      investment_id: id,
      transaction_date: new Date(),
      amount: amount,
      type: type,
      tax: taxAmount,
      net_amount: netTransactionAmount,
    };

    return this.createTransactionUseCase.createTransaction(transaction);
  }
}
