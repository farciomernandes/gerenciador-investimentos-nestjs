export abstract class IDeleteInvestmentUseCase {
  abstract execute(id: string): Promise<void>;
}
