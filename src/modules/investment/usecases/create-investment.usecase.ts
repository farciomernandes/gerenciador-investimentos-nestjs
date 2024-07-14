import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from '../dtos/create-investment.dto';
import { InvestmentProvider } from '../providers/investment.provider';
import { Investment } from '../entities/investment.entity';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentStatus } from '../enums/investments';

@Injectable()
export class CreateInvestmentUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly investmentProvider: InvestmentProvider,
  ) {}

  async execute(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    const user = await this.userRepository.findOne({
      where: { id: createInvestmentDto.owner_id },
    });

    if (!user) {
      throw new BadRequestException('User não encontrado');
    }
    const investmentAlreadyExists = await this.investmentProvider.findByName(
      createInvestmentDto.name,
      createInvestmentDto.owner_id,
    );
    if (investmentAlreadyExists) {
      return this.investmentProvider.update(
        {
          amount: createInvestmentDto.initial_value,
          type: 'input',
        },
        investmentAlreadyExists.id,
      );
    }
    const investment = new Investment();
    investment.owner = user;
    investment.initial_value = createInvestmentDto.initial_value;
    investment.creation_date = createInvestmentDto.creation_date;
    investment.current_value = createInvestmentDto.initial_value;
    investment.name = createInvestmentDto.name;
    investment.status = InvestmentStatus.IN_PROGRESS;

    return this.investmentProvider.create(investment);
  }
}
