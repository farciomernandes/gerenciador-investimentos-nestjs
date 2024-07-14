import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';
import { Investment } from '@modules/investment/entities/investment.entity';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';

@Injectable()
export class GetInvestmentsUseCase {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async execute(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<ResponseInvestmentDto> {
    let query: FindManyOptions<Investment> | undefined = {
      relations: ['owner'],
      skip: (page - 1) * limit,
      take: limit,
    };

    if (status) {
      query = {
        ...query,
        where: { status: InvestmentStatus[status] },
      };
    }

    const [investments, total] =
      await this.investmentRepository.findAndCount(query);
    const totalPages = Math.ceil(total / limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
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
