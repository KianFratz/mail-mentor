import { validateEnvironment } from './environment';

const dev = {
  DATABASE_URL: 'postgresql://localhost/mail',
  JWT_SECRET: 'dev-access',
  JWT_REFRESH_SECRET: 'dev-refresh',
};
const prod = {
  ...dev,
  NODE_ENV: 'production',
  JWT_SECRET: 'a'.repeat(32),
  JWT_REFRESH_SECRET: 'b'.repeat(32),
  FRONTEND_URL: 'https://app.example.com',
  BACKEND_URL: 'https://api.example.com',
  GOOGLE_CLIENT_ID: 'client',
  GOOGLE_CLIENT_SECRET: 'secret',
  OLLAMA_API_KEY: 'ollama-key',
  XENDIT_SECRET_KEY: 'secret',
  XENDIT_WEBHOOK_TOKEN: 'token',
  MAIL_HOST: 'smtp.example.com',
  MAIL_PORT: '465',
  MAIL_USER: 'user',
  MAIL_PASS: 'pass',
  MAIL_FROM: 'mail@example.com',
};

describe('environment validation', () => {
  it('allows local development without Google, payment, or SMTP credentials', () => {
    expect(validateEnvironment(dev).NODE_ENV).toBe('development');
  });
  it('requires Google OAuth credentials to be configured together', () => {
    expect(() =>
      validateEnvironment({ ...dev, GOOGLE_CLIENT_ID: 'client' }),
    ).toThrow('GOOGLE_CLIENT_SECRET');
  });
  it('accepts complete production configuration', () => {
    expect(validateEnvironment(prod).NODE_ENV).toBe('production');
  });
  it('accepts a display name in MAIL_FROM', () => {
    expect(
      validateEnvironment({
        ...prod,
        MAIL_FROM: 'Mail Mentor <mail@example.com>',
      }).NODE_ENV,
    ).toBe('production');
  });
  it.each(Object.keys(prod).filter((key) => key !== 'NODE_ENV'))(
    'rejects missing production %s',
    (key) => {
      expect(() => validateEnvironment({ ...prod, [key]: ' ' })).toThrow(key);
    },
  );
  it.each([
    { DATABASE_URL: 'https://example.com' },
    { FRONTEND_URL: 'http://example.com' },
    { BACKEND_URL: 'invalid' },
    { MAIL_PORT: 'NaN' },
    { PORT: '65536' },
    { JWT_SECRET: 'short' },
    { JWT_REFRESH_SECRET: prod.JWT_SECRET },
    { NODE_ENV: 'prod' },
    { MAIL_FROM: 'invalid' },
  ])('rejects invalid configuration %j', (override) => {
    expect(() => validateEnvironment({ ...prod, ...override })).toThrow(
      'Invalid environment configuration',
    );
  });
  it('reports all missing keys without revealing values', () => {
    expect(() =>
      validateEnvironment({
        NODE_ENV: 'production',
        DATABASE_URL: 'private-value',
      }),
    ).toThrow(/JWT_SECRET[\s\S]*XENDIT_SECRET_KEY/);
    try {
      validateEnvironment({ DATABASE_URL: 'private-value' });
    } catch (error) {
      expect(String(error)).not.toContain('private-value');
    }
  });
});
