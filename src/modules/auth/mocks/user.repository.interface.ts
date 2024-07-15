export abstract class UserRepositoryInterface {
  abstract findOne(options: any): Promise<any | null>;
}
