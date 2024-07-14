import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';

export abstract class IGetInvestmentsUseCase {
  abstract execute(
    page: number,
    limit: number,
    status?: string,
  ): Promise<ResponseInvestmentDto>;

  abstract buildResponse(
    investments: InvestmentDto[],
    totalPages: number,
  ): ResponseInvestmentDto;
}
