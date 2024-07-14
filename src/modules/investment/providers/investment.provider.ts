import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Investment } from '../entities/investment.entity';
import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '../dtos/response-investment.dto';
import { FindManyOptions } from 'typeorm';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { InvesmentParamsDTO } from '../dtos/investment-params.dto';
import { InvestmentStatus } from '../enums/investments';
import { UpdateInvestmentDto } from '../dtos/update-investment.dto';
import { CreateWithdrawalDto } from '@modules/withdrawal/dtos/create-withdrawal.dto';
import { WithdrawalProvider } from '@modules/withdrawal/providers/wihdrawal.provider';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';

@Injectable()
export class InvestmentProvider {
  constructor(
    private readonly investmentRepository: InvestmentRepository,
    private readonly withdrawalProvider: WithdrawalProvider,
  ) {}

  async create(payload: Investment): Promise<Investment> {
    const investment = await this.investmentRepository.save(payload);
    return Investment.toDto(investment);
  }

  async update(payload: UpdateInvestmentDto, id: string): Promise<Investment> {
    const investment = await this.getInvestmentById(id);
    if (!investment) {
      throw new BadRequestException(`Investment with ID ${id} not found`);
    }

    const amount = Number(payload.amount);
    if (isNaN(amount)) {
      throw new BadRequestException('Invalid amount provided');
    }

    const updatedValue = this.calculateUpdatedValue(investment, payload);
    if (updatedValue < 0) {
      throw new BadRequestException(
        'Investment update would result in negative current_value',
      );
    }

    investment.current_value = updatedValue;
    return this.investmentRepository.save(investment);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseInvestmentDto> {
    const [investments, total] = await this.investmentRepository.findAndCount({
      relations: ['owner'],
      skip: (page - 1) * limit,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
  }

  async findAllByOwnerId(
    ownerId: string,
    params: InvesmentParamsDTO,
  ): Promise<ResponseInvestmentDto> {
    const options: FindManyOptions<Investment> = {
      relations: ['owner'],
      where: { owner: { id: ownerId } },
      skip: (params.page - 1) * params.limit,
      take: params.limit,
    };

    if (params.status) {
      this.validateStatus(params.status);
      options.where = { ...options.where, status: params.status };
    }

    const [investments, total] =
      await this.investmentRepository.findAndCount(options);
    const totalPages = Math.ceil(total / params.limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
  }

  async findAllWithStatus(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<ResponseInvestmentDto> {
    if (status) {
      this.validateStatus(status);
    }
    let options: FindManyOptions<Investment> | undefined = {
      relations: ['owner'],
      skip: (page - 1) * limit,
      take: limit,
    };

    if (status) {
      options = {
        ...options,
        where: { status: InvestmentStatus[status] },
      };
    }

    const [investments, total] =
      await this.investmentRepository.findAndCount(options);
    const totalPages = Math.ceil(total / limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
  }

  async findByName(name: string, ownerId: string): Promise<Investment | null> {
    const investment = await this.investmentRepository.findOne({
      where: { name },
      relations: ['owner'],
    });

    if (!investment || investment.owner.id !== ownerId) {
      return null;
    }

    return investment;
  }

  async findById(id: string): Promise<Investment | null> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });

    if (!investment) {
      return null;
    }

    return investment;
  }

  private async getInvestmentById(id: string): Promise<Investment | null> {
    return this.investmentRepository.findOne({ where: { id } });
  }

  private calculateUpdatedValue(
    investment: Investment,
    payload: UpdateInvestmentDto,
  ): number {
    const amount = Number(payload.amount);
    if (payload.type === 'input') {
      return Number(investment.current_value) + amount;
    } else {
      return Number(investment.current_value) - amount;
    }
  }

  private validateStatus(status: string): void {
    if (!Object.values(InvestmentStatus).includes(status as InvestmentStatus)) {
      throw new BadRequestException(`Invalid status type: ${status}.`);
    }
  }

  async withdraw(id: string): Promise<Withdrawal> {
    const investment = await this.findById(id);
    if (!investment) {
      throw new NotFoundException(`Investment with ID ${id} not found`);
    }

    const currentValue = this.calculateCurrentValue(investment);
    const taxRate = this.getTaxRate(investment.created_at);
    const taxAmount = currentValue * taxRate;
    const withdrawalAmount = currentValue - taxAmount;

    investment.current_value = 0;
    await this.investmentRepository.save(investment);
    const withdrawal: CreateWithdrawalDto = {
      investment_id: id,
      withdrawal_date: new Date(),
      amount: currentValue,
      tax: taxAmount,
      net_amount: withdrawalAmount,
    };

    const createdWithdrawal =
      await this.withdrawalProvider.createWithdrawal(withdrawal);

    return createdWithdrawal;
  }

  private calculateCurrentValue(investment: Investment): number {
    const months = this.getMonthsSinceCreation(investment.created_at);
    const interestRate = 0.0052; // 0,52% ao mês
    const currentValue =
      investment.initial_value * Math.pow(1 + interestRate, months);
    return currentValue;
  }

  private getMonthsSinceCreation(createAt: Date): number {
    const today = new Date();
    const months =
      (today.getFullYear() - createAt.getFullYear()) * 12 +
      today.getMonth() -
      createAt.getMonth();
    return months;
  }

  private getTaxRate(createAt: Date): number {
    const age = this.getAge(createAt);
    if (age < 1) {
      return 0.225;
    } else if (age < 2) {
      return 0.185;
    } else {
      return 0.15;
    }
  }

  private getAge(createAt: Date): number {
    const today = new Date();
    const age = today.getFullYear() - createAt.getFullYear();
    return age;
  }

  private buildResponse(
    investments: InvestmentDto[],
    totalPages: number,
  ): ResponseInvestmentDto {
    return {
      investments,
      totalPages,
    };
  }
}
