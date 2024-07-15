import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { InvestmentController } from './investment.controller';
import { InvestmentProvider } from './providers/investment.provider';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
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
import { CreateTransactionUseCase } from '@modules/transaction/usecases/create-transaction/create-transaction.usecase';
import { ICreateTransactionUseCase } from '@modules/transaction/usecases/create-transaction/interface/create-transaction.interface';
import { TransactionRepositoryInterface } from '@modules/transaction/mocks/transaction.respository.interface';
import { InvestmentRepositoryInterface } from './mocks/investment.respository.interface';

@Module({
  imports: [UserModule, TransactionModule],
  providers: [
    InvestmentRepository,
    UserRepository,
    {
      provide: TransactionRepositoryInterface,
      useClass: TransactionRepository,
    },
    {
      provide: InvestmentRepositoryInterface,
      useClass: InvestmentRepository,
    },
    {
      provide: ICreateTransactionUseCase,
      useFactory: (
        transactionRepository: TransactionRepositoryInterface,
        investmentRepository: InvestmentRepositoryInterface,
      ) => {
        return new CreateTransactionUseCase(
          transactionRepository,
          investmentRepository,
        );
      },
      inject: [TransactionRepository, InvestmentRepository],
    },
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
        transactionRepository: TransactionRepositoryInterface,
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
      useFactory: (investmentRepository: InvestmentRepository) => {
        return new GetInvestmentUseCase(investmentRepository);
      },
      inject: [InvestmentRepository],
    },
    {
      provide: IGetInvestmentsUseCase,
      useClass: GetInvestmentsUseCase,
    },
    {
      provide: IGetInvestmentsByOwnerIdUseCase,
      useFactory: (investmentRepository: InvestmentRepositoryInterface) => {
        return new GetInvestmentsByOwnerIdUseCase(investmentRepository);
      },
      inject: [InvestmentRepository],
    },
    {
      provide: IGetInvestmentsWithStatusUseCase,
      useFactory: (investmentRepository: InvestmentRepositoryInterface) => {
        return new GetInvestmentsWithStatusUseCase(investmentRepository);
      },
      inject: [InvestmentRepository],
    },
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
      inject: [InvestmentRepository, CreateTransactionUseCase],
    },
    {
      provide: IGetInvestmentDetailsUseCase,
      useFactory: (
        investmentRepository: InvestmentRepositoryInterface,
        transactionRepository: TransactionRepositoryInterface,
      ) => {
        return new GetInvestmentDetailsUseCase(
          investmentRepository,
          transactionRepository,
        );
      },
      inject: [InvestmentRepository, TransactionRepository],
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
