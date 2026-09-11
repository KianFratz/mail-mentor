import {
  ArgumentsHost,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { redact, StructuredLogger } from './structured-logger';
import { PublicErrorFilter } from './public-error.filter';

describe('safe logs and errors', () => {
  it('redacts nested secrets and personal data', () => {
    expect(
      redact({
        nested: { authorization: 'secret', payload: { card: '123' } },
        message: 'a@example.com https://pay.example/secret',
      }),
    ).toEqual({
      nested: { authorization: '[REDACTED]', payload: '[REDACTED]' },
      message: '[REDACTED_EMAIL] [REDACTED_URL]',
    });
  });
  it('redacts configured secrets, errors, and cycles', () => {
    process.env.TEST_API_KEY = 'private-key';
    try {
      expect(redact('failed private-key')).toBe('failed [REDACTED]');
    } finally {
      delete process.env.TEST_API_KEY;
    }
    expect(JSON.stringify(redact(new Error('private detail')))).not.toContain(
      'private detail',
    );
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    expect(redact(circular)).toEqual({ self: '[Circular]' });
  });
  it('writes valid JSON without multiline log injection', () => {
    const write = jest.spyOn(process.stdout, 'write').mockReturnValue(true);
    try {
      new StructuredLogger().log('hello\nworld');
      const line = String(write.mock.calls[0][0]);
      expect(line.split('\n')).toHaveLength(2);
      expect(JSON.parse(line)).toMatchObject({
        level: 'info',
        message: 'hello\nworld',
      });
    } finally {
      write.mockRestore();
    }
  });
  it.each([
    new Error('secret'),
    new InternalServerErrorException('secret'),
    new BadRequestException(['email must be valid']),
  ])('normalizes public errors', (exception) => {
    const response = {
      headersSent: false,
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const host = {
      switchToHttp: () => ({ getResponse: () => response }),
    } as unknown as ArgumentsHost;
    new PublicErrorFilter().catch(exception, host);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message:
          exception instanceof BadRequestException
            ? ['email must be valid']
            : 'Internal server error',
      }),
    );
  });
});
