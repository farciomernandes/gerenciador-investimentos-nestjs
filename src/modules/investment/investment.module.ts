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

@Module({
  imports: [UserModule, WithdrawalModule],
  providers: [
    InvestmentRepository,
    UserRepository,
    WithdrawalProvider,
    WithdrawalRepository,
    CreateInvestmentUseCase,
    UpdateInvestmentUseCase,
    GetInvestmentUseCase,
    GetInvestmentsUseCase,
    GetInvestmentsByOwnerIdUseCase,
    GetInvestmentsWithStatusUseCase,
    WithdrawInvestmentUseCase,
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
        CreateInvestmentUseCase,
        UpdateInvestmentUseCase,
        GetInvestmentUseCase,
        GetInvestmentsUseCase,
        GetInvestmentsByOwnerIdUseCase,
        GetInvestmentsWithStatusUseCase,
        GetInvestmentsWithStatusUseCase,
        WithdrawInvestmentUseCase,
      ],
    },
  ],
  controllers: [InvestmentController],
})
export class InvestmentModule {}
