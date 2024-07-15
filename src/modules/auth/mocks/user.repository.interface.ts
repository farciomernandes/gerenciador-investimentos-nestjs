import { User } from '@modules/user/entities/users.entity';

export abstract class UserRepositoryInterface {
  abstract findOne(options: any): Promise<any | null>;
  abstract create(user: Partial<User>): User;
  abstract save(user: User): Promise<User>;
  abstract find(options: any): Promise<User[]>;
  abstract findOneOrFail(options: any): Promise<any>;
}
