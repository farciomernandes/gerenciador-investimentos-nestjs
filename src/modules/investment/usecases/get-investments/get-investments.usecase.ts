import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';
import { Investment } from '@modules/investment/entities/investment.entity';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { IGetInvestmentsUseCase } from './interfaces/get-investments.interface';
import { InvestmentRepositoryInterface } from '@modules/investment/mocks/investment.respository.interface';

@Injectable()
export class GetInvestmentsUseCase implements IGetInvestmentsUseCase {
  constructor(
    private readonly investmentRepository: InvestmentRepositoryInterface,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<ResponseInvestmentDto> {
    let query: FindManyOptions<Investment> = {
      relations: ['owner'],
      skip: (page - 1) * limit,
      take: limit,
    };

    if (status) {
      query.where = { status: InvestmentStatus[status] };
    }

    const [investments, total] =
      await this.investmentRepository.findAndCount(query);

    const totalPages = Math.ceil(total / limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
  }

  buildResponse(
    investments: InvestmentDto[],
    totalPages: number,
  ): ResponseInvestmentDto {
    return {
      investments,
      totalPages,
    };
  }
}
