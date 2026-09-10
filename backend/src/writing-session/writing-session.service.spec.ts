import { Test, TestingModule } from '@nestjs/testing';
import { WritingSessionService } from './writing-session.service';
import { PrismaService } from 'prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('WritingSessionService', () => {
  let service: WritingSessionService;
  let prisma: {
    writingSession: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    scenario: { findUnique: jest.Mock };
    message: { create: jest.Mock };
    sessionFeedback: {
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      create: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      writingSession: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      scenario: { findUnique: jest.fn() },
      message: { create: jest.fn() },
      sessionFeedback: {
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WritingSessionService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WritingSessionService>(WritingSessionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('loads session history only for the owning user', async () => {
    const session = { id: 'session-id', userId: 'user-id' };
    prisma.writingSession.findFirst.mockResolvedValue(session);

    await expect(
      service.getSessionWithHistory('session-id', 'user-id'),
    ).resolves.toBe(session);

    expect(prisma.writingSession.findFirst).toHaveBeenCalledWith({
      where: { id: 'session-id', userId: 'user-id' },
      include: {
        scenario: true,
        messages: { orderBy: { createdAt: 'asc' } },
        sessionFeedback: true,
      },
    });
  });

  it('returns not found when a session is not owned by the user', async () => {
    prisma.writingSession.findFirst.mockResolvedValue(null);

    await expect(
      service.getSessionWithHistory('session-id', 'other-user-id'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('checks ownership before saving a user message', async () => {
    prisma.writingSession.findFirst.mockResolvedValue({ id: 'session-id' });
    prisma.message.create.mockResolvedValue({ id: 'message-id' });

    await service.saveUserMessage('session-id', 'user-id', 'hello');

    expect(prisma.writingSession.findFirst).toHaveBeenCalledWith({
      where: { id: 'session-id', userId: 'user-id' },
      select: { id: true },
    });
    expect(prisma.message.create).toHaveBeenCalledWith({
      data: {
        writingSessionId: 'session-id',
        role: 'USER',
        content: 'hello',
      },
    });
  });

  it('does not save a message for a non-owned session', async () => {
    prisma.writingSession.findFirst.mockResolvedValue(null);

    await expect(
      service.saveUserMessage('session-id', 'other-user-id', 'hello'),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(prisma.message.create).not.toHaveBeenCalled();
  });

  it('loads feedback only for the owning user', async () => {
    const feedback = { id: 'feedback-id' };
    prisma.sessionFeedback.findFirst.mockResolvedValue(feedback);

    await expect(service.getFeedback('session-id', 'user-id')).resolves.toBe(
      feedback,
    );

    expect(prisma.sessionFeedback.findFirst).toHaveBeenCalledWith({
      where: {
        writingSessionId: 'session-id',
        writingSession: { userId: 'user-id' },
      },
    });
  });
});
