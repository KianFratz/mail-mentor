import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  NotFoundException,
} from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import express from 'express';
import request from 'supertest';
import { AiController } from '../src/ai/ai.controller';
import { AiService } from '../src/ai/ai.service';
import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { WritingSessionController } from '../src/writing-session/writing-session.controller';
import { WritingSessionService } from '../src/writing-session/writing-session.service';

class HeaderUserGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    request.user = {
      userId: request.headers['x-user-id'] ?? 'user-a',
      email: 'test@example.com',
    };
    return true;
  }
}

describe('Session ownership (e2e)', () => {
  let app: INestApplication;
  let writingSessionService: {
    getSessionWithHistory: jest.Mock;
    getFeedback: jest.Mock;
  };
  let aiService: {
    reply: jest.Mock;
    generateFeedback: jest.Mock;
  };

  beforeEach(async () => {
    writingSessionService = {
      getSessionWithHistory: jest.fn(),
      getFeedback: jest.fn(),
    };
    aiService = {
      reply: jest.fn(),
      generateFeedback: jest.fn(),
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [WritingSessionController, AiController],
      providers: [
        { provide: WritingSessionService, useValue: writingSessionService },
        { provide: AiService, useValue: aiService },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(HeaderUserGuard)
      .compile();

    app = moduleFixture.createNestApplication(new ExpressAdapter(express()));
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('prevents user B from reading user A session history', async () => {
    writingSessionService.getSessionWithHistory.mockRejectedValue(
      new Error('not reached'),
    );
    writingSessionService.getSessionWithHistory.mockImplementation(
      (sessionId: string, userId: string) => {
        if (sessionId === 'session-a' && userId !== 'user-a') {
          throw new NotFoundException('Session with ID "session-a" not found.');
        }
        return { id: sessionId, userId };
      },
    );

    await request(app.getHttpServer())
      .get('/writing-session/session-a')
      .set('x-user-id', 'user-b')
      .expect(404);

    expect(writingSessionService.getSessionWithHistory).toHaveBeenCalledWith(
      'session-a',
      'user-b',
    );
  });

  it('prevents user B from reading user A feedback', async () => {
    writingSessionService.getFeedback.mockImplementation(
      (sessionId: string, userId: string) => {
        if (sessionId === 'session-a' && userId !== 'user-a') {
          throw new NotFoundException('No feedback found for "session-a".');
        }
        return { id: 'feedback-a' };
      },
    );

    await request(app.getHttpServer())
      .get('/writing-session/session-a/feedback')
      .set('x-user-id', 'user-b')
      .expect(404);

    expect(writingSessionService.getFeedback).toHaveBeenCalledWith(
      'session-a',
      'user-b',
    );
  });

  it('passes the authenticated user into AI reply mutations', async () => {
    aiService.reply.mockResolvedValue('hello');

    await request(app.getHttpServer())
      .post('/writing-sessions/session-a/reply')
      .set('x-user-id', 'user-b')
      .send({ message: 'Hi', wordCount: 1 })
      .expect(201);

    expect(aiService.reply).toHaveBeenCalledWith(
      'user-b',
      'session-a',
      'Hi',
      1,
    );
  });

  it('passes the authenticated user into AI feedback generation', async () => {
    aiService.generateFeedback.mockResolvedValue({ id: 'feedback-a' });

    await request(app.getHttpServer())
      .post('/writing-sessions/session-a/feedback?localDate=2026-09-10')
      .set('x-user-id', 'user-b')
      .expect(201);

    expect(aiService.generateFeedback).toHaveBeenCalledWith(
      'session-a',
      'user-b',
      '2026-09-10',
    );
  });
});
