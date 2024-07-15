import { CreateInvestmentDto } from '@modules/investment/dtos/create-investment.dto';
import { ResponseInvestmentDetails } from '@modules/investment/dtos/response-investment-details.dto';

export abstract class ICreateInvestmentUseCase {
  abstract execute(
    createInvestmentDto: CreateInvestmentDto,
  ): Promise<ResponseInvestmentDetails>;
}
