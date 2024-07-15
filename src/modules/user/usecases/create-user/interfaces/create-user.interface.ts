import { User } from '@modules/user/entities/users.entity';
import { CreateUserDto } from '@modules/user/dtos/create-user.dto';

export abstract class ICreateUserUseCase {
  abstract execute(payload: CreateUserDto): Promise<User>;
}
