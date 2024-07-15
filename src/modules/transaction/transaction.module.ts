import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { Module } from '@nestjs/common';
import { TransactionProvider } from './providers/transaction.provider';
import { TransactionController } from './transaction.controller';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionInvestmentUseCase } from '@modules/investment/usecases/transaction-investment/transaction-investment.usecase';

@Module({
  imports: [],
  providers: [
    TransactionRepository,
    TransactionProvider,
    InvestmentRepository,
    TransactionInvestmentUseCase,
  ],
  controllers: [TransactionController],
})
export class TransactionModule {}
