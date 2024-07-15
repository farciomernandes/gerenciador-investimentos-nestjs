import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionInvestmentUseCase } from '@modules/investment/usecases/transaction-investment/transaction-investment.usecase';
import { CreateTransactionUseCase } from './usecases/create-transaction/create-transaction.usecase';
import { ICreateTransactionUseCase } from './usecases/create-transaction/interface/create-transaction.interface';
import { TransactionRepositoryInterface } from './mocks/transaction.respository.interface';

@Module({
  imports: [],
  providers: [
    TransactionRepository,
    {
      provide: ICreateTransactionUseCase,
      useFactory: (
        transactionRepository: TransactionRepositoryInterface,
        investmentRepository: InvestmentRepository,
      ) => {
        return new CreateTransactionUseCase(
          transactionRepository,
          investmentRepository,
        );
      },
      inject: [TransactionRepository, InvestmentRepository],
    },
    InvestmentRepository,
    TransactionInvestmentUseCase,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
