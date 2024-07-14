import { InvesmentParamsDTO } from '@modules/investment/dtos/investment-params.dto';
import {
  InvestmentDto,
  ResponseInvestmentDto,
} from '@modules/investment/dtos/response-investment.dto';

export abstract class IGetInvestmentsByOwnerIdUseCase {
  abstract execute(
    ownerId: string,
    params: InvesmentParamsDTO,
  ): Promise<ResponseInvestmentDto>;

  abstract validateStatus(status: string): void;

  abstract buildResponse(
    investments: InvestmentDto[],
    totalPages: number,
  ): ResponseInvestmentDto;
}
