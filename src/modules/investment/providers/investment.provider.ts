import { BadRequestException, Injectable } from '@nestjs/common';
import { Investment } from '../entities/investment.entity';
import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '../dto/response-investment.dto';
import { FindManyOptions, FindOptionsWhere } from 'typeorm';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { InvesmentParamsDTO } from '../dto/investment-params.dto';
import { InvestmentStatus } from '../enums/investments';
import { CreateInvestmentDto } from '../dto/create-investment.dto';

@Injectable()
export class InvestmentProvider {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async create(payload: Investment): Promise<Investment> {
    const investment = await this.investmentRepository.save(payload);
    return Investment.toDto(investment);
  }

  async update(payload: CreateInvestmentDto, id: string): Promise<Investment> {
    const investment = await this.investmentRepository.findOne({
      where: { id },
    });

    if (!investment) {
      throw new BadRequestException(`Investment with ID ${id} not found`);
    }

    const newValue = Number(payload.initial_value);

    if (isNaN(newValue)) {
      throw new BadRequestException('Invalid current_value provided');
    }

    const updatedValue = Number(investment.current_value) + newValue;

    if (updatedValue < 0) {
      throw new BadRequestException(
        'Investment update would result in negative current_value',
      );
    }

    investment.current_value = Number(updatedValue);

    return this.investmentRepository.save(investment);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<ResponseInvestmentDto> {
    const skip = (page - 1) * limit;
    const [investments, total] = await this.investmentRepository.findAndCount({
      relations: ['owner'],
      skip,
      take: limit,
    });
    const totalPages = Math.ceil(total / limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
  }

  async findAllByOwnerId(
    owner_id: string,
    { page, limit, status }: InvesmentParamsDTO,
  ): Promise<ResponseInvestmentDto> {
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Investment> = {
      relations: ['owner'],
      where: {
        owner: { id: owner_id },
      } as FindOptionsWhere<Investment>,
      skip,
      take: limit,
    };

    if (status !== undefined && status !== null) {
      if (
        !Object.values(InvestmentStatus).includes(status as InvestmentStatus)
      ) {
        throw new BadRequestException(`Invalid status type: ${status}.`);
      }

      options.where = {
        ...options.where,
        status,
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

  async findAllWithStatus(
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<ResponseInvestmentDto> {
    if (status) {
      if (
        !Object.values(InvestmentStatus).includes(status as InvestmentStatus)
      ) {
        throw new BadRequestException(`Invalid status type: ${status}.`);
      }
    }
    const skip = (page - 1) * limit;
    const options: FindManyOptions<Investment> = {
      relations: ['owner'],
      where: {
        ...(status ? { status } : {}),
      } as FindOptionsWhere<Investment>,
      skip,
      take: limit,
    };
    const [investments, total] =
      await this.investmentRepository.findAndCount(options);
    const totalPages = Math.ceil(total / limit);
    return this.buildResponse(
      investments.map((investment) => InvestmentDto.toDto(investment)),
      totalPages,
    );
  }

  async findByName(name: string, owner_id: string): Promise<Investment | null> {
    const investment = await this.investmentRepository.findOne({
      where: { name },
      relations: ['owner'],
    });

    if (!investment || investment.owner.id != owner_id) {
      return null;
    }

    return investment;
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
