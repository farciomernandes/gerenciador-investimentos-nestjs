import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { InvestmentProvider } from './providers/investment.provider';
import { InvestmentController } from './investment.controller';
import { CreateInvestmentUseCase } from './usecases/create-investment.usecase';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { WithdrawalProvider } from '@modules/withdrawal/providers/wihdrawal.provider';
import { WithdrawalModule } from '@modules/withdrawal/withdrawal.module';
import { WithdrawalRepository } from '@infra/typeorm/repositories/withdrawal.respository';

@Module({
  imports: [UserModule, WithdrawalModule],
  providers: [
    InvestmentProvider,
    InvestmentRepository,
    UserRepository,
    {
      provide: WithdrawalRepository,
      useClass: WithdrawalRepository,
    },
    WithdrawalProvider,
    {
      provide: CreateInvestmentUseCase,
      useFactory: (
        userRepository: UserRepository,
        investmentProvider: InvestmentProvider,
      ): CreateInvestmentUseCase => {
        return new CreateInvestmentUseCase(userRepository, investmentProvider);
      },
      inject: [UserRepository, InvestmentProvider],
    },
  ],
  controllers: [InvestmentController],
})
export class InvestmentModule {}
