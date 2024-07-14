import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';

export abstract class IGetInvestmentsWithStatusUseCase {
  abstract execute(
    page: number,
    limit: number,
    status?: string,
  ): Promise<ResponseInvestmentDto>;

  abstract validateStatus(status: string): void;
  abstract buildResponse(
    investments: InvestmentDto[],
    totalPages: number,
  ): ResponseInvestmentDto;
}
