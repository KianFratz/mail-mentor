import { ConfigService } from '@nestjs/config';
import { getRequiredJwtSecret } from './jwt-secret';

describe('getRequiredJwtSecret', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  function configWith(value: string | undefined): ConfigService {
    return {
      get: jest.fn().mockReturnValue(value),
    } as unknown as ConfigService;
  }

  it('returns the configured secret', () => {
    const secret = 'a-secure-dev-secret';

    expect(getRequiredJwtSecret(configWith(secret), 'JWT_SECRET')).toBe(secret);
  });

  it('throws when the secret is missing', () => {
    expect(() =>
      getRequiredJwtSecret(configWith(undefined), 'JWT_SECRET'),
    ).toThrow('JWT_SECRET is required');
  });

  it('rejects short production secrets', () => {
    process.env.NODE_ENV = 'production';

    expect(() =>
      getRequiredJwtSecret(configWith('short'), 'JWT_REFRESH_SECRET'),
    ).toThrow(
      'JWT_REFRESH_SECRET must be at least 32 characters in production',
    );
  });
});
