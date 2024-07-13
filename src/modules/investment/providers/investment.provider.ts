import { Injectable } from '@nestjs/common';
import { Investment } from '../entities/investment.entity';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { ResponseInvestmentDto } from '../dto/response-investment.dto';

@Injectable()
export class InvestmentProvider {
  constructor(private readonly investmentRepository: InvestmentRepository) {}

  async create(payload: Investment): Promise<ResponseInvestmentDto> {
    const investment = await this.investmentRepository.save(payload);

    return ResponseInvestmentDto.toDto(investment);
  }

  async findAll(): Promise<any[]> {
    const investments = await this.investmentRepository.find({
      relations: ['owner'],
    });

    return investments.map((investment) =>
      ResponseInvestmentDto.toDto(investment),
    );
  }

  async findAllByOwnerId(owner_id: string): Promise<ResponseInvestmentDto[]> {
    const investments = await this.investmentRepository.find({
      relations: ['owner'],
      where: { owner: { id: owner_id } },
    });

    return investments.map((investment) =>
      ResponseInvestmentDto.toDto(investment),
    );
  }
}
