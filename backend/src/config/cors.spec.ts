import { ConfigService } from '@nestjs/config';
import { getCorsOrigins } from './cors';

describe('getCorsOrigins', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  function configWith(
    values: Record<string, string | undefined>,
  ): ConfigService {
    return {
      get: jest.fn((key: string) => values[key]),
    } as unknown as ConfigService;
  }

  it('uses comma-separated CORS_ORIGINS', () => {
    const origins = getCorsOrigins(
      configWith({
        CORS_ORIGINS: 'https://app.example.com, https://admin.example.com',
      }),
    );

    expect(origins).toEqual([
      'https://app.example.com',
      'https://admin.example.com',
    ]);
  });

  it('includes FRONTEND_URL when CORS_ORIGINS is not set', () => {
    expect(
      getCorsOrigins(configWith({ FRONTEND_URL: 'https://app.example.com' })),
    ).toEqual(['https://app.example.com']);
  });

  it('falls back to localhost outside production', () => {
    process.env.NODE_ENV = 'development';

    expect(getCorsOrigins(configWith({}))).toEqual(['http://localhost:5173']);
  });

  it('fails closed in production when no origin is configured', () => {
    process.env.NODE_ENV = 'production';

    expect(() => getCorsOrigins(configWith({}))).toThrow(
      'CORS_ORIGINS or FRONTEND_URL is required in production',
    );
  });
});
