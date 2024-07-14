import { TransactionInvestmentDto } from '@modules/investment/dtos/update-investment.dto';
import { Transaction } from '@modules/transaction/entities/transaction.entity';

export abstract class ITransactionInvestmentUseCase {
  abstract execute(
    id: string,
    withdrawalValue: TransactionInvestmentDto,
  ): Promise<Transaction>;
}