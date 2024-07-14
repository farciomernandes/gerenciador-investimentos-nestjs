import { BcryptHashUtils } from './bcrypt-hash.utils';

jest.mock('bcrypt', () => ({
  async hash(password: string, rounds: number): Promise<string> {
    return `${password}-hashed-${rounds}`;
  },
}));

describe('BcryptHashUtils', () => {
  it('should return a hashed password', async () => {
    const password = 'password';
    const rounds = 6;

    const hashedPassword = await BcryptHashUtils.handle(password, rounds);

    expect(hashedPassword).toEqual(`${password}-hashed-${rounds}`);
  });

  it('should return a hashed password by passing just first parameter', async () => {
    const password = 'password';

    const hashedPassword = await BcryptHashUtils.handle(password);

    expect(hashedPassword).toEqual(`${password}-hashed-6`);
  });
});
