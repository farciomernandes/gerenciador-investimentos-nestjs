import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from '../../dtos/create-investment.dto';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentStatus } from '../../enums/investments';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { ICreateInvestmentUseCase } from './interfaces/create-investment.interface';
import { Investment } from '@modules/investment/entities/investment.entity';
import {
  INVESTMENT_RETURN_RATE,
  InvestmentCalculations,
} from '@modules/@shared/utils/investment-calculations.utils';
import { ResponseInvestmentDetails } from '@modules/investment/dtos/response-investment-details.dto';
import { TransactionRepository } from '@infra/typeorm/repositories/transaction.respository';
import { TransactionTypes } from '@modules/transaction/enums/transaction';
import { User } from '@modules/user/entities/users.entity';
import { Transaction } from '@modules/transaction/entities/transaction.entity';

@Injectable()
export class CreateInvestmentUseCase implements ICreateInvestmentUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly investmentRepository: InvestmentRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}

  async execute(
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<ResponseInvestmentDetails> {
    const user = await this.getUser(createInvestmentDto.owner_id);
    if (!user) {
      throw new BadRequestException('User não encontrado');
    }

    const investmentAlreadyExists =
      await this.investmentRepository.getWithTransactions(
        createInvestmentDto.name,
        createInvestmentDto.owner_id,
      );
    if (investmentAlreadyExists) {
      throw new BadRequestException(
        `Investimento com ${createInvestmentDto.name} nome já existe, tente realizar uma transação!`,
      );
    }

    const investment = await this.createInvestment(createInvestmentDto, user);

    const transaction = await this.createTransaction(
      createInvestmentDto,
      investment,
    );

    await this.saveTransaction(transaction);

    return this.buildReturn(investment, [transaction]);
  }

  private async getUser(ownerId: string): Promise<User> {
    return this.userRepository.findOneOrFail({ where: { id: ownerId } });
  }

  private async createInvestment(
    createInvestmentDto: CreateInvestmentDto,
    user: User,
  ): Promise<Investment> {
    const investmentBody = new Investment();
    investmentBody.initial_value = createInvestmentDto.initial_value;
    investmentBody.creation_date = createInvestmentDto.creation_date;
    investmentBody.current_value = createInvestmentDto.initial_value;
    investmentBody.name = createInvestmentDto.name;
    investmentBody.status = InvestmentStatus.IN_PROGRESS;
    investmentBody.owner = user;
    investmentBody.owner_id = user.id;

    const investment = this.investmentRepository.create(investmentBody);

    return this.investmentRepository.save(investment);
  }

  private async createTransaction(
    createInvestmentDto: CreateInvestmentDto,
    investment: Investment,
  ): Promise<Transaction> {
    const taxRate = InvestmentCalculations.getTaxRate(
      createInvestmentDto.creation_date,
    );
    const netAmount = createInvestmentDto.initial_value * (1 - taxRate);

    return this.transactionRepository.create({
      investment_id: investment.id,
      transaction_date: createInvestmentDto.creation_date,
      amount: createInvestmentDto.initial_value,
      type: TransactionTypes.INPUT,
      tax: taxRate,
      net_amount: netAmount,
    });
  }

  private async saveTransaction(transaction: Transaction): Promise<void> {
    await this.transactionRepository.save(transaction);
  }

  private buildReturn(
    investment: Investment,
    transactions: Transaction[],
  ): ResponseInvestmentDetails {
    const expectedBalance = InvestmentCalculations.calculateCurrentValue(
      investment.initial_value,
      INVESTMENT_RETURN_RATE,
      InvestmentCalculations.getMonthsSinceCreation(
        new Date(investment.creation_date),
      ),
    );

    return {
      investment: {
        id: investment.id,
        name: investment.name,
        creation_date: investment.creation_date,
        initial_value: investment.initial_value,
        current_value: investment.current_value,
        status: investment.status,
      },
      transactions,
      expectedBalance,
    };
  }
}
