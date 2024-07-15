import { BadRequestException, Injectable } from '@nestjs/common';
import {
  ListTransactionDto,
  TransactionResponse,
} from '../dtos/list-transaction.dto';
import { PaginationFilter } from 'src/shared/filter/pagination.filter';
import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { TAX_RATES } from '@modules/@shared/utils/investment-calculations.utils';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';

@Injectable()
export class TransactionProvider {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly investmentRepository: InvestmentRepository,
  ) {}

  async createTransaction(payload: any): Promise<any> {
    let taxRate = payload.tax ? payload.tax : 0;
    let taxAmount = payload.tax ? payload.tax : 0;
    let netAmount = payload.net_amount ? payload.net_amount : 0;

    const investment = await this.investmentRepository.findOneOrFail({
      where: { id: payload.investment_id },
    });

    if (payload.type === 'INPUT') {
      taxRate = this.getTaxRate(new Date(payload.transaction_date));
      taxAmount = payload.amount * taxRate;
      netAmount = payload.amount - taxAmount;
      investment.current_value =
        Number(payload.amount) + Number(investment.current_value);
    } else {
      const amount = Number(investment.current_value) - Number(payload.amount);

      if (amount < 0) {
        throw new BadRequestException(
          'O valor da retirada não pode ser maior que o valor atual do investimento',
        );
      }
      investment.current_value = amount;
    }

    const transaction = this.transactionRepository.create({
      ...payload,
      tax: taxRate,
      tax_amount: taxAmount,
      net_amount: netAmount,
    });

    await this.investmentRepository.save(investment);
    return await this.transactionRepository.save(transaction);
  }

  async getTransactions(
    queryParams: PaginationFilter,
  ): Promise<ListTransactionDto> {
    const { page, limit } = queryParams;
    const offset = (page - 1) * limit;

    const [transactions, count] = await this.transactionRepository.findAndCount(
      {
        skip: offset,
        take: limit,
      },
    );

    const totalPages = Math.ceil(count / limit);

    const transactionsFormated: TransactionResponse[] = transactions.map(
      (transaction) => {
        const taxRate = this.getTaxRate(transaction.transaction_date);
        const taxAmount = transaction.amount * taxRate;
        const netAmount = transaction.amount - taxAmount;

        const transactionResponse: TransactionResponse = {
          id: transaction.id,
          investment_id: transaction.investment_id,
          transaction_date: transaction.transaction_date,
          amount: Number(transaction.amount),
          type: transaction.type,
          tax: taxAmount,
          net_amount: netAmount,
        };
        return transactionResponse;
      },
    );

    return {
      transactions: transactionsFormated,
      totalPages,
    };
  }

  private getTaxRate(transactionDate: Date): number {
    const ageInYears = this.getAgeInYears(transactionDate);
    if (ageInYears < 1) {
      return TAX_RATES.LESS_THAN_ONE_YEAR;
    } else if (ageInYears < 2) {
      return TAX_RATES.BETWEEN_ONE_AND_TWO_YEARS;
    } else {
      return TAX_RATES.MORE_THAN_TWO_YEARS;
    }
  }

  private getAgeInYears(transactionDate: Date): number {
    const today = new Date();
    const ageInMilliseconds = today.getTime() - transactionDate.getTime();
    const ageInYears = ageInMilliseconds / (1000 * 3600 * 24 * 365);
    return ageInYears;
  }
}
