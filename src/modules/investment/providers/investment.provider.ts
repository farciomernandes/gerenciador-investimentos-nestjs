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
import { UpdateInvestmentDto } from '../dto/update-investment.dto';

@Injectable()
export class InvestmentProvider {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

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
    owner_id: string,
    { page, limit, status }: InvesmentParamsDTO,
  ): Promise<ResponseInvestmentDto> {
    const options: FindManyOptions<Investment> = {
      relations: ['owner'],
      where: {
        owner: { id: owner_id },
      } as FindOptionsWhere<Investment>,
      skip: (page - 1) * limit,
      take: limit,
    };

    if (status !== undefined && status !== null) {
      this.validateStatus(status);
      options.where = { ...options.where, status };
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
      this.validateStatus(status);
    }
    const options: FindManyOptions<Investment> = {
      relations: ['owner'],
      where: {
        ...(status ? { status } : {}),
      } as FindOptionsWhere<Investment>,
      skip: (page - 1) * limit,
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
