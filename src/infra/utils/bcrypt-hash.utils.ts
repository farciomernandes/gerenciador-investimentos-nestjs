import * as bcrypt from 'bcrypt';

export class BcryptHashUtils {
  public static async handle(password: string, rounds = 6): Promise<string> {
    return await bcrypt.hash(password, rounds);
  }

  public static async verifyOldPassword(
    newPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(newPassword, userPassword);
  }
}
