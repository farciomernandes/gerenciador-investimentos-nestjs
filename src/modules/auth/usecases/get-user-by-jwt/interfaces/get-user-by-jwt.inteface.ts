export abstract class IGetUserByJwtUseCase {
  abstract execute(id: string): Promise<any>;
}
