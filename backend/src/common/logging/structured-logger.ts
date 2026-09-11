import { LoggerService } from '@nestjs/common';

const sensitiveKey =
  /password|pass$|secret|token|authorization|cookie|email|payload|metadata|body|headers|payer|customer|userId|externalId/i;

export function redact(value: unknown, seen = new WeakSet<object>()): unknown {
  if (value instanceof Error) return { error: 'Error details omitted' };
  if (typeof value === 'string') {
    let result = value;
    for (const [key, secret] of Object.entries(process.env)) {
      if (
        /SECRET|TOKEN|PASSWORD|PASS$|API_KEY|DATABASE_URL/.test(key) &&
        secret
      ) {
        result = result.split(secret).join('[REDACTED]');
      }
    }
    return result
      .replace(/Bearer\s+\S+/gi, 'Bearer [REDACTED]')
      .replace(/\b(?:https?|postgres(?:ql)?):\/\/\S+/gi, '[REDACTED_URL]')
      .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[REDACTED_EMAIL]');
  }
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return '[Circular]';
  seen.add(value);
  if (Array.isArray(value)) return value.map((item) => redact(item, seen));
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sensitiveKey.test(key) ? '[REDACTED]' : redact(item, seen),
    ]),
  );
}

/** One JSON record per line. Never pass raw request bodies or provider responses. */
export class StructuredLogger implements LoggerService {
  log(message: unknown, ...context: unknown[]) {
    this.write('info', message, context);
  }
  error(message: unknown, ...context: unknown[]) {
    this.write('error', message, context);
  }
  warn(message: unknown, ...context: unknown[]) {
    this.write('warn', message, context);
  }
  debug(message: unknown, ...context: unknown[]) {
    this.write('debug', message, context);
  }
  verbose(message: unknown, ...context: unknown[]) {
    this.write('trace', message, context);
  }
  fatal(message: unknown, ...context: unknown[]) {
    this.write('fatal', message, context);
  }
  private write(level: string, message: unknown, context: unknown[]) {
    const line = JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      message: redact(message),
      context: redact(context),
    });
    (level === 'error' || level === 'fatal'
      ? process.stderr
      : process.stdout
    ).write(line + '\n');
  }
}
