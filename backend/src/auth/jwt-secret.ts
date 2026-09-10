import { ConfigService } from '@nestjs/config';

const PRODUCTION_MIN_SECRET_LENGTH = 32;

export function getRequiredJwtSecret(
  configService: ConfigService,
  key: 'JWT_SECRET' | 'JWT_REFRESH_SECRET',
): string {
  const value = configService.get<string>(key);

  if (!value) {
    throw new Error(`${key} is required`);
  }

  if (
    process.env.NODE_ENV === 'production' &&
    value.length < PRODUCTION_MIN_SECRET_LENGTH
  ) {
    throw new Error(
      `${key} must be at least ${PRODUCTION_MIN_SECRET_LENGTH} characters in production`,
    );
  }

  return value;
}
