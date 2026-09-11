import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';

@Catch()
export class PublicErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger(PublicErrorFilter.name);
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : 500;
    let message: string | string[] = 'Internal server error';
    if (status < 500 && exception instanceof HttpException) {
      const body = exception.getResponse();
      const detail =
        typeof body === 'string'
          ? body
          : (body as { message?: string | string[] }).message;
      message = detail || 'Request failed';
    }
    if (status >= 500)
      this.logger.error({
        event: 'api_failure',
        statusCode: status,
        requestId: response.locals?.requestId,
      });
    if (!response.headersSent)
      response.status(status).json({
        statusCode: status,
        requestId: response.locals?.requestId,
        error: HttpStatus[status] || 'ERROR',
        message,
      });
  }
}
