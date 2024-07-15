import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { InvestmentController } from './investment.controller';
import { InvestmentProvider } from './providers/investment.provider';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { TransactionProvider } from '@modules/transaction/providers/transaction.provider';
import { CreateInvestmentUseCase } from './usecases/create-investment/create-investment.usecase';
import { UpdateInvestmentUseCase } from './usecases/update-investment/update-investment.usecase';
import { GetInvestmentUseCase } from './usecases/get-investment/get-investment.usecase';
import { GetInvestmentsUseCase } from './usecases/get-investments/get-investments.usecase';
import { GetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/get-investments-by-owner-id.usecase';
import { GetInvestmentsWithStatusUseCase } from './usecases/get-investments-with-status/get-investments-with-status.usecase';
import { TransactionInvestmentUseCase } from './usecases/transaction-investment/transaction-investment.usecase';
import { ICreateInvestmentUseCase } from './usecases/create-investment/interfaces/create-investment.interface';
import { IUpdateInvestmentUseCase } from './usecases/update-investment/interfaces/update-investment.interface';
import { IGetInvestmentUseCase } from './usecases/get-investment/interfaces/get-investment.interface';
import { IGetInvestmentsUseCase } from './usecases/get-investments/interfaces/get-investments.interface';
import { IGetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/interfaces/get-investments-by-owner-id.interface';
import { IGetInvestmentsWithStatusUseCase } from './usecases/get-investments-with-status/interface/get-investments-with-status.interface';
import { IGetInvestmentDetailsUseCase } from './usecases/get-investment-details/interface/get-investment-details.interface';
import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { ITransactionInvestmentUseCase } from './usecases/transaction-investment/interfaces/transaction-investment.interface';
import { GetInvestmentDetailsUseCase } from './usecases/get-investment-details/get-investment-details.usecase';

@Module({
  imports: [UserModule, TransactionModule],
  providers: [
    InvestmentRepository,
    UserRepository,
    TransactionProvider,
    TransactionRepository,
    TransactionInvestmentUseCase,
    {
      provide: IUpdateInvestmentUseCase,
      useFactory: (
        investmentRepository: InvestmentRepository,
        transactionRepository: TransactionRepository,
      ) => {
        return new UpdateInvestmentUseCase(
          investmentRepository,
          transactionRepository,
        );
      },
      inject: [InvestmentRepository, TransactionRepository],
    },
    {
      provide: ICreateInvestmentUseCase,
      useFactory: (
        userRepository: UserRepository,
        investmentRepository: InvestmentRepository,
        transactionRepository: TransactionRepository,
      ) => {
        return new CreateInvestmentUseCase(
          userRepository,
          investmentRepository,
          transactionRepository,
        );
      },
      inject: [UserRepository, InvestmentRepository, TransactionRepository],
    },
    {
      provide: IGetInvestmentUseCase,
      useClass: GetInvestmentUseCase,
    },
    {
      provide: IGetInvestmentsUseCase,
      useClass: GetInvestmentsUseCase,
    },
    {
      provide: IGetInvestmentsByOwnerIdUseCase,
      useClass: GetInvestmentsByOwnerIdUseCase,
    },
    {
      provide: IGetInvestmentsWithStatusUseCase,
      useClass: GetInvestmentsWithStatusUseCase,
    },
    {
      provide: ITransactionInvestmentUseCase,
      useClass: TransactionInvestmentUseCase,
    },
    {
      provide: IGetInvestmentDetailsUseCase,
      useClass: GetInvestmentDetailsUseCase,
    },
    InvestmentProvider,
    {
      provide: InvestmentProvider,
      useFactory: (
        createInvestmentUseCase: CreateInvestmentUseCase,
        updateInvestmentUseCase: UpdateInvestmentUseCase,
        getInvestmentUseCase: GetInvestmentUseCase,
        getInvestmentsUseCase: GetInvestmentsUseCase,
        getInvestmentsByOwnerIdUseCase: GetInvestmentsByOwnerIdUseCase,
        getInvestmentsWithStatusUseCase: GetInvestmentsWithStatusUseCase,
        TransactionInvestmentUseCase: TransactionInvestmentUseCase,
        getInvestmentDetailsUseCase: GetInvestmentDetailsUseCase,
      ) => {
        return new InvestmentProvider(
          createInvestmentUseCase,
          updateInvestmentUseCase,
          getInvestmentUseCase,
          getInvestmentsUseCase,
          getInvestmentsByOwnerIdUseCase,
          getInvestmentsWithStatusUseCase,
          TransactionInvestmentUseCase,
          getInvestmentDetailsUseCase,
        );
      },
      inject: [
        ICreateInvestmentUseCase,
        IUpdateInvestmentUseCase,
        IGetInvestmentUseCase,
        IGetInvestmentsUseCase,
        IGetInvestmentsByOwnerIdUseCase,
        IGetInvestmentsWithStatusUseCase,
        IGetInvestmentsWithStatusUseCase,
        ITransactionInvestmentUseCase,
        IGetInvestmentDetailsUseCase,
      ],
    },
  ],
  controllers: [InvestmentController],
})
export class InvestmentModule {}
