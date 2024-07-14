import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { InvesmentParamsDTO } from '@modules/investment/dtos/investment-params.dto';
import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';
import { Investment } from '@modules/investment/entities/investment.entity';
import { InvestmentStatus } from '@modules/investment/enums/investments';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import { IGetInvestmentsByOwnerIdUseCase } from './interfaces/get-investments-by-owner-id.interface';

@Injectable()
export class GetInvestmentsByOwnerIdUseCase
  implements IGetInvestmentsByOwnerIdUseCase
{
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async execute(
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

  validateStatus(status: string): void {
    if (!Object.values(InvestmentStatus).includes(status as InvestmentStatus)) {
      throw new BadRequestException(`Invalid status type: ${status}.`);
    }
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
