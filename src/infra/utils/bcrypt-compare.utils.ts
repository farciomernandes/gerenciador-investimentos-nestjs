import * as bcrypt from 'bcrypt';

export class BcryptCompareUtils {
  public static async handle(
    plainText: string,
    encrypted: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainText, encrypted);
  }
}
