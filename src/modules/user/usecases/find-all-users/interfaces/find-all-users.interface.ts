import { UserResponseDto } from '@modules/user/dtos/create-user.dto';

export abstract class IFindAllUsersUseCase {
  abstract execute(): Promise<UserResponseDto[]>;
}
