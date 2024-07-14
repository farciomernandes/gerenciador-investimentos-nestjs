export abstract class IGetInvestmentDetailsUseCase {
  abstract execute(investment_id: string): Promise<any>;
}
