/** Validate before Nest constructs database and external-service providers. */
export function validateEnvironment(env: Record<string, unknown>) {
  const errors: string[] = [];
  const value = (key: string) => String(env[key] ?? '').trim();
  const mode = value('NODE_ENV') || 'development';
  const production = mode === 'production';
  if (!['development', 'test', 'production'].includes(mode)) {
    errors.push('NODE_ENV must be development, test, or production');
  }
  const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
  if (production)
    required.push(
      'FRONTEND_URL',
      'BACKEND_URL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'OLLAMA_API_KEY',
      'XENDIT_SECRET_KEY',
      'XENDIT_WEBHOOK_TOKEN',
      'MAIL_HOST',
      'MAIL_PORT',
      'MAIL_USER',
      'MAIL_PASS',
      'MAIL_FROM',
    );
  const hasGoogleClientId = Boolean(value('GOOGLE_CLIENT_ID'));
  const hasGoogleClientSecret = Boolean(value('GOOGLE_CLIENT_SECRET'));
  if (hasGoogleClientId !== hasGoogleClientSecret) {
    errors.push(
      'GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured together',
    );
  }
  for (const key of required) {
    if (!value(key)) errors.push(`${key} is required in ${mode}`);
  }
  for (const key of ['DATABASE_URL', 'FRONTEND_URL', 'BACKEND_URL']) {
    if (!value(key)) continue;
    try {
      const url = new URL(value(key));
      const protocols =
        key === 'DATABASE_URL'
          ? ['postgres:', 'postgresql:']
          : production
            ? ['https:']
            : ['http:', 'https:'];
      if (
        !protocols.includes(url.protocol) ||
        !url.hostname ||
        (key !== 'DATABASE_URL' &&
          (url.username || url.password || url.search || url.hash))
      )
        throw new Error();
    } catch {
      errors.push(
        `${key} must be a valid ${key === 'DATABASE_URL' ? 'PostgreSQL' : production ? 'HTTPS' : 'HTTP(S)'} URL without query or fragment for app URLs`,
      );
    }
  }
  for (const key of ['PORT', 'MAIL_PORT']) {
    if (
      value(key) &&
      (!/^\d+$/.test(value(key)) ||
        Number(value(key)) < 1 ||
        Number(value(key)) > 65535)
    ) {
      errors.push(`${key} must be an integer between 1 and 65535`);
    }
  }
  if (production) {
    for (const key of ['JWT_SECRET', 'JWT_REFRESH_SECRET']) {
      if (value(key) && value(key).length < 32)
        errors.push(`${key} must be at least 32 characters in production`);
    }
    if (
      value('JWT_SECRET') &&
      value('JWT_SECRET') === value('JWT_REFRESH_SECRET')
    )
      errors.push(
        'JWT_SECRET and JWT_REFRESH_SECRET must differ in production',
      );
  }
  if (
    value('MAIL_FROM') &&
    !/^([^\s@<>]+@[^\s@<>]+\.[^\s@<>]+|[^<>]+<[^@\s<>]+@[^@\s<>]+\.[^@\s<>]+>)$/.test(
      value('MAIL_FROM'),
    )
  )
    errors.push('MAIL_FROM must be an email address');
  if (errors.length)
    throw new Error(
      `Invalid environment configuration:\n- ${errors.join('\n- ')}`,
    );
  return { ...env, NODE_ENV: mode };
}
