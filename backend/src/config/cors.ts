import { ConfigService } from '@nestjs/config';

const DEV_DEFAULT_ORIGIN = 'http://localhost:5173';

function splitOrigins(value: string | undefined): string[] {
  return (
    value
      ?.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean) ?? []
  );
}

export function getCorsOrigins(configService: ConfigService): string[] {
  const origins = [
    ...splitOrigins(configService.get<string>('CORS_ORIGINS')),
    ...splitOrigins(configService.get<string>('FRONTEND_URL')),
  ];
  const uniqueOrigins = [...new Set(origins)];

  if (uniqueOrigins.length > 0) {
    return uniqueOrigins;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('CORS_ORIGINS or FRONTEND_URL is required in production');
  }

  return [DEV_DEFAULT_ORIGIN];
}
