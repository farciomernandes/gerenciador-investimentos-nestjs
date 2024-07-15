import { Injectable } from '@nestjs/common';
import { Investment } from '../entities/investment.entity';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import {
  UpdateInvestmentDto,
  TransactionInvestmentDto,
} from '../dtos/update-investment.dto';
import { ResponseInvestmentDto } from '../dtos/response-investment.dto';
import { Transaction } from '@modules/transaction/entities/transaction.entity';
import { ICreateInvestmentUseCase } from '../usecases/create-investment/interfaces/create-investment.interface';
import { IUpdateInvestmentUseCase } from '../usecases/update-investment/interfaces/update-investment.interface';
import { IGetInvestmentUseCase } from '../usecases/get-investment/interfaces/get-investment.interface';
import { IGetInvestmentsUseCase } from '../usecases/get-investments/interfaces/get-investments.interface';
import { IGetInvestmentsByOwnerIdUseCase } from '../usecases/get-investments-by-owner-id/interfaces/get-investments-by-owner-id.interface';
import { IGetInvestmentsWithStatusUseCase } from '../usecases/get-investments-with-status/interface/get-investments-with-status.interface';
import { ITransactionInvestmentUseCase } from '../usecases/transaction-investment/interfaces/transaction-investment.interface';
import { IGetInvestmentDetailsUseCase } from '../usecases/get-investment-details/interface/get-investment-details.interface';
import { ResponseInvestmentDetails } from '../dtos/response-investment-details.dto';

@Injectable()
export class InvestmentProvider {
  constructor(
    private readonly createInvestmentUseCase: ICreateInvestmentUseCase,
    private readonly updateInvestmentUseCase: IUpdateInvestmentUseCase,
    private readonly getInvestmentUseCase: IGetInvestmentUseCase,
    private readonly getInvestmentsUseCase: IGetInvestmentsUseCase,
    private readonly getInvestmentsByOwnerIdUseCase: IGetInvestmentsByOwnerIdUseCase,
    private readonly getInvestmentsWithStatusUseCase: IGetInvestmentsWithStatusUseCase,
    private readonly transactionInvestmentUseCase: ITransactionInvestmentUseCase,
    private readonly getInvestmentDetailsUseCase: IGetInvestmentDetailsUseCase,
  ) {}

  async getDetails(investment_id: string): Promise<any> {
    return this.getInvestmentDetailsUseCase.execute(investment_id);
  }

  async create(
    payload: CreateInvestmentDto,
  ): Promise<ResponseInvestmentDetails> {
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

  async transaction(
    id: string,
    transactionValue: TransactionInvestmentDto,
  ): Promise<Transaction> {
    return this.transactionInvestmentUseCase.execute(id, transactionValue);
  }
}
