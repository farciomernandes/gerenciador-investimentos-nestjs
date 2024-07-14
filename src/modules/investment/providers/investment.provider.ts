import { Injectable } from '@nestjs/common';
import { CreateInvestmentUseCase } from '../usecases/create-investment/create-investment.usecase';
import { UpdateInvestmentUseCase } from '../usecases/update-investment/update-investment.usecase';
import { GetInvestmentUseCase } from '../usecases/get-investment/get-investment.usecase';
import { GetInvestmentsUseCase } from '../usecases/get-investments/get-investments.usecase';
import { GetInvestmentsByOwnerIdUseCase } from '../usecases/get-investments-by-owner-id/get-investments-by-owner-id.usecase';
import { GetInvestmentsWithStatusUseCase } from '../usecases/get-investments-with-status/get-investments-with-status.usecase';
import { WithdrawInvestmentUseCase } from '../usecases/withdraw-investment/withdraw-investment.usecase';
import { Investment } from '../entities/investment.entity';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { UpdateInvestmentDto } from '../dtos/update-investment.dto';
import { ResponseInvestmentDto } from '../dtos/response-investment.dto';
import { Withdrawal } from '@modules/withdrawal/entities/withdrawal.entity';

@Injectable()
export class InvestmentProvider {
  constructor(
    private readonly createInvestmentUseCase: CreateInvestmentUseCase,
    private readonly updateInvestmentUseCase: UpdateInvestmentUseCase,
    private readonly getInvestmentUseCase: GetInvestmentUseCase,
    private readonly getInvestmentsUseCase: GetInvestmentsUseCase,
    private readonly getInvestmentsByOwnerIdUseCase: GetInvestmentsByOwnerIdUseCase,
    private readonly getInvestmentsWithStatusUseCase: GetInvestmentsWithStatusUseCase,
    private readonly withdrawInvestmentUseCase: WithdrawInvestmentUseCase,
  ) {}

  async create(payload: CreateInvestmentDto): Promise<Investment> {
    return this.createInvestmentUseCase.execute(payload);
  }

  async update(payload: UpdateInvestmentDto, id: string): Promise<Investment> {
    return this.updateInvestmentUseCase.execute(payload, id);
  }

  async get(id: string): Promise<Investment | null> {
    return this.getInvestmentUseCase.execute(id);
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseInvestmentDto> {
    return this.getInvestmentsUseCase.execute(page, limit);
  }

  async getByOwnerId(
    ownerId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseInvestmentDto> {
    return this.getInvestmentsByOwnerIdUseCase.execute(ownerId, {
      page,
      limit,
    });
  }

  async getByStatus(
    status: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseInvestmentDto> {
    return this.getInvestmentsWithStatusUseCase.execute(page, limit, status);
  }

  async withdraw(id: string): Promise<Withdrawal> {
    return this.withdrawInvestmentUseCase.execute(id);
  }
}
