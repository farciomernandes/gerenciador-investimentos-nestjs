import { TransactionInvestmentDto } from '@modules/investment/dtos/update-investment.dto';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { TransactionTypes } from '@modules/transaction/enums/transaction';

export abstract class ITransactionInvestmentUseCase {
  abstract execute(
    id: string,
    withdrawalValue: TransactionInvestmentDto,
    type?: TransactionTypes,
  ): Promise<Transaction>;
}
