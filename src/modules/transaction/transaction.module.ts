import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionInvestmentUseCase } from '@modules/investment/usecases/transaction-investment/transaction-investment.usecase';
import { CreateTransactionUseCase } from './usecases/create-transaction/create-transaction.usecase';
import { ICreateTransactionUseCase } from './usecases/create-transaction/interface/create-transaction.interface';
import { TransactionRepositoryInterface } from './mocks/transaction.respository.interface';
import { ITransactionInvestmentUseCase } from '@modules/investment/usecases/transaction-investment/interfaces/transaction-investment.interface';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';

@Module({
  imports: [],
  providers: [
    TransactionRepository,
    {
      provide: InvestmentRepositoryInterface,
      useClass: InvestmentRepository,
    },
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
    {
      provide: ITransactionInvestmentUseCase,
      useFactory: (
        investmentRepository: InvestmentRepositoryInterface,
        createTransactionUseCase: ICreateTransactionUseCase,
      ) => {
        return new TransactionInvestmentUseCase(
          investmentRepository,
          createTransactionUseCase,
        );
      },
      inject: [InvestmentRepositoryInterface, ICreateTransactionUseCase],
    },
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
