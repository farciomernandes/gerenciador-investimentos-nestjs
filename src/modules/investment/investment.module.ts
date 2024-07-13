import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { InvestmentProvider } from './providers/investment.provider';
import { InvestmentController } from './investment.controller';
import { CreateInvestmentUseCase } from './usecases/create-investment.usecase';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';

@Module({
  imports: [UserModule],
  providers: [
    InvestmentProvider,
    InvestmentRepository,
    UserRepository,
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
