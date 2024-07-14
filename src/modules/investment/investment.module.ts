import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { InvestmentController } from './investment.controller';
import { InvestmentProvider } from './providers/investment.provider';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { WithdrawalModule } from '@modules/withdrawal/withdrawal.module';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { WithdrawalProvider } from '@modules/withdrawal/providers/wihdrawal.provider';
import { WithdrawalRepository } from '@infra/typeorm/repositories/withdrawal.respository';
import { CreateInvestmentUseCase } from './usecases/create-investment/create-investment.usecase';
import { UpdateInvestmentUseCase } from './usecases/update-investment/update-investment.usecase';
import { GetInvestmentUseCase } from './usecases/get-investment/get-investment.usecase';
import { GetInvestmentsUseCase } from './usecases/get-investments/get-investments.usecase';
import { GetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/get-investments-by-owner-id.usecase';
import { GetInvestmentsWithStatusUseCase } from './usecases/get-investments-with-status/get-investments-with-status.usecase';
import { WithdrawInvestmentUseCase } from './usecases/withdraw-investment/withdraw-investment.usecase';
import { ICreateInvestmentUseCase } from './usecases/create-investment/interfaces/create-investment.interface';
import { IUpdateInvestmentUseCase } from './usecases/update-investment/interfaces/update-investment.interface';
import { IGetInvestmentUseCase } from './usecases/get-investment/interfaces/get-investment.interface';
import { IGetInvestmentsUseCase } from './usecases/get-investments/interfaces/get-investments.interface';
import { IGetInvestmentsByOwnerIdUseCase } from './usecases/get-investments-by-owner-id/interfaces/get-investments-by-owner-id.interface';
import { IGetInvestmentsWithStatusUseCase } from './usecases/get-investments-with-status/interface/get-investments-with-status.interface';
import { IWithdrawInvestmentUseCase } from './usecases/withdraw-investment/interfaces/withdraw-investment.interface';
import { IDeleteInvestmentUseCase } from './usecases/delete-investment/interfaces/delete-investment.interface';
import { DeleteInvestmentUseCase } from './usecases/delete-investment/delete-investment.usecase';

@Module({
  imports: [UserModule, WithdrawalModule],
  providers: [
    InvestmentRepository,
    UserRepository,
    WithdrawalProvider,
    WithdrawalRepository,
    {
      provide: IUpdateInvestmentUseCase,
      useFactory: (investmentRepository: InvestmentRepository) => {
        return new UpdateInvestmentUseCase(investmentRepository);
      },
      inject: [InvestmentRepository],
    },
    {
      provide: ICreateInvestmentUseCase,
      useFactory: (
        updateInvestmentUseCase: IUpdateInvestmentUseCase,
        userRepository: UserRepository,
        investmentRepository: InvestmentRepository,
      ) => {
        return new CreateInvestmentUseCase(
          updateInvestmentUseCase,
          userRepository,
          investmentRepository,
        );
      },
      inject: [IUpdateInvestmentUseCase, UserRepository, InvestmentRepository],
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
      provide: IWithdrawInvestmentUseCase,
      useClass: WithdrawInvestmentUseCase,
    },
    {
      provide: IDeleteInvestmentUseCase,
      useClass: DeleteInvestmentUseCase,
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
        withdrawInvestmentUseCase: WithdrawInvestmentUseCase,
      ) => {
        return new InvestmentProvider(
          createInvestmentUseCase,
          updateInvestmentUseCase,
          getInvestmentUseCase,
          getInvestmentsUseCase,
          getInvestmentsByOwnerIdUseCase,
          getInvestmentsWithStatusUseCase,
          withdrawInvestmentUseCase,
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
        IWithdrawInvestmentUseCase,
      ],
    },
  ],
  controllers: [InvestmentController],
})
export class InvestmentModule {}
