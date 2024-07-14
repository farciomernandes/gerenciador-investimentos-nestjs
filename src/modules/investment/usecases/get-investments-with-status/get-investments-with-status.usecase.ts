import { BadRequestException, Injectable } from '@nestjs/common';
import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { FindManyOptions } from 'typeorm';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { Investment } from '@modules/investment/entities/investment.entity';

@Injectable()
export class GetInvestmentsWithStatusUseCase {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async execute(
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

  private validateStatus(status: string): void {
    if (!Object.values(InvestmentStatus).includes(status as InvestmentStatus)) {
      throw new BadRequestException(`Invalid status type: ${status}.`);
    }
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
