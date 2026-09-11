import { ExpressAdapter } from '@nestjs/platform-express';
import { Controller, Get, INestApplication, Logger } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicErrorFilter } from './common/logging/public-error.filter';
import { requestLogging } from './common/logging/request-logging';

@Controller('test')
class FailureController {
  @Get(':id')
  fail() {
    throw new Error('private provider response');
  }
}

describe('deployment observability HTTP integration', () => {
  let app: INestApplication;
  let logs: jest.SpyInstance[];
  beforeAll(async () => {
    logs = ['log', 'warn', 'error'].map((level) =>
      jest.spyOn(Logger.prototype, level as 'log').mockImplementation(() => {}),
    );
    const module = await Test.createTestingModule({
      controllers: [AppController, FailureController],
      providers: [AppService],
    }).compile();
    app = module.createNestApplication(new ExpressAdapter());
    app.use(requestLogging);
    app.useGlobalFilters(new PublicErrorFilter());
    await app.init();
  });
  afterAll(async () => {
    await app.close();
    logs.forEach((log) => log.mockRestore());
  });
  beforeEach(() => logs.forEach((log) => log.mockClear()));

  it('serves liveness with application metadata and a generated request ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .set('X-Request-ID', 'untrusted')
      .expect(200);
    expect(response.body).toEqual({
      status: 'ok',
      app: 'mail-mentor-api',
      version: expect.any(String),
      uptimeSeconds: expect.any(Number),
    });
    expect(response.headers['x-request-id']).toMatch(/^[\da-f-]{36}$/);
    expect(logs[0]).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'http_request',
        route: '/health',
        statusCode: 200,
        durationMs: expect.any(Number),
      }),
    );
  });
  it('correlates server errors without leaking request or exception data', async () => {
    const response = await request(app.getHttpServer())
      .get('/test/private-user?token=private-token')
      .expect(500);
    expect(response.body.message).toBe('Internal server error');
    expect(response.body.requestId).toBe(response.headers['x-request-id']);
    expect(logs[2]).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'http_request',
        route: '/test/:id',
        statusCode: 500,
        requestId: response.headers['x-request-id'],
      }),
    );
    expect(JSON.stringify(logs.map((log) => log.mock.calls))).not.toMatch(
      /private-user|private-token|private provider/,
    );
  });
  it('logs unmatched client failures without their raw URL', async () => {
    await request(app.getHttpServer())
      .get('/private-path?secret=value')
      .expect(404);
    expect(logs[1]).toHaveBeenCalledWith(
      expect.objectContaining({ route: 'unmatched', statusCode: 404 }),
    );
    expect(JSON.stringify(logs[1].mock.calls)).not.toContain('private-path');
  });
});
