import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from '../dto/create-investment.dto';
import { InvestmentProvider } from '../providers/investment.provider';
import { Investment } from '../entities/investment.entity';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentStatus } from '../enums/investments';
import { ResponseInvestmentDto } from '../dto/response-investment.dto';

@Injectable()
export class CreateInvestmentUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly investmentProvider: InvestmentProvider,
  ) {}

  async execute(
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<ResponseInvestmentDto> {
    const user = await this.userRepository.findOne({
      where: { id: createInvestmentDto.owner_id },
    });

    if (!user) {
      throw new BadRequestException('User não encontrado');
    }
    const investment = new Investment();
    investment.owner = user;
    investment.initial_value = createInvestmentDto.initial_value;
    investment.creation_date = createInvestmentDto.creation_date;
    investment.current_value = createInvestmentDto.current_value;
    investment.status = InvestmentStatus.IN_PROGRESS;

    return this.investmentProvider.create(investment);
  }
}
