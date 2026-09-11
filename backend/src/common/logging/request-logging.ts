import { Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { appMetadata } from '../../app-metadata';

const logger = new Logger('HttpRequest');

export function requestLogging(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const start = performance.now();
  // Generate locally: do not trust a caller-supplied correlation ID.
  const requestId = randomUUID();
  res.locals.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  let logged = false;
  const log = (aborted: boolean) => {
    if (logged) return;
    logged = true;
    const statusCode = aborted ? 499 : res.statusCode;
    const entry = {
      event: 'http_request',
      ...appMetadata,
      requestId,
      method: req.method,
      // Only a server-defined route template; never log raw paths or queries.
      route: typeof req.route?.path === 'string' ? req.route.path : 'unmatched',
      statusCode,
      durationMs: Math.round((performance.now() - start) * 100) / 100,
      aborted,
    };
    if (statusCode >= 500) logger.error(entry);
    else if (statusCode >= 400) logger.warn(entry);
    else logger.log(entry);
  };
  res.once('finish', () => log(false));
  res.once('close', () => log(!res.writableFinished));
  next();
}
