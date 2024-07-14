import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateInvestmentDto } from '../../dtos/create-investment.dto';
import { Investment } from '../../entities/investment.entity';
import { UserRepository } from '@infra/typeorm/repositories/user.repository';
import { InvestmentStatus } from '../../enums/investments';
import { InvestmentRepository } from '@infra/typeorm/repositories/investment.respository';
import { ICreateInvestmentUseCase } from './interfaces/create-investment.interface';
import { IUpdateInvestmentUseCase } from '../update-investment/interfaces/update-investment.interface';

@Injectable()
export class CreateInvestmentUseCase implements ICreateInvestmentUseCase {
  constructor(
    private readonly updateInvestmentUseCase: IUpdateInvestmentUseCase,
    private readonly userRepository: UserRepository,
    private readonly investmentRepository: InvestmentRepository,
  ) {}

  async execute(createInvestmentDto: CreateInvestmentDto): Promise<Investment> {
    const user = await this.userRepository.findOne({
      where: { id: createInvestmentDto.owner_id },
    });

    if (!user) {
      throw new BadRequestException('User não encontrado');
    }
    const investmentAlreadyExists = await this.investmentRepository.findOne({
      where: {
        name: createInvestmentDto.name,
        owner: {
          id: createInvestmentDto.owner_id,
        },
      },
    });
    if (investmentAlreadyExists) {
      return this.updateInvestmentUseCase.execute(
        {
          amount: createInvestmentDto.initial_value,
          type: 'input',
        },
        investmentAlreadyExists.id,
      );
    }
    const investment = new CreateInvestmentDto();

    investment.initial_value = createInvestmentDto.initial_value;
    investment.creation_date = createInvestmentDto.creation_date;
    investment.current_value = createInvestmentDto.initial_value;
    investment.name = createInvestmentDto.name;
    investment.status = InvestmentStatus.IN_PROGRESS;

    const investmentCreated =
      await this.investmentRepository.create(investment);
    investmentCreated.owner = user;

    return await this.investmentRepository.save({ ...investmentCreated });
  }
}
