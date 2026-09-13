import { Test, TestingModule } from '@nestjs/testing';
import { ScenariosService } from './scenarios.service';
import { PrismaService } from 'prisma/prisma.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CACHE_TTL, cacheKeys } from 'src/cache/cache-policy';

describe('ScenariosService', () => {
  let service: ScenariosService;
  let prisma: any;
  let cache: any;

  beforeEach(async () => {
    prisma = {
      scenario: { findMany: jest.fn(), findUnique: jest.fn() },
      writingSession: { findMany: jest.fn() },
    };
    cache = { get: jest.fn(), set: jest.fn(), del: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenariosService,
        { provide: PrismaService, useValue: prisma },
        { provide: CACHE_MANAGER, useValue: cache },
      ],
    }).compile();

    service = module.get<ScenariosService>(ScenariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('serves an empty scenario list from cache', async () => {
    cache.get.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);
    expect(prisma.scenario.findMany).not.toHaveBeenCalled();
  });

  it('caches scenario lists for one hour after a miss', async () => {
    const scenarios = [{ id: 'scenario-1' }];
    cache.get.mockResolvedValue(undefined);
    prisma.scenario.findMany.mockResolvedValue(scenarios);

    await expect(service.findAll()).resolves.toBe(scenarios);
    expect(cache.set).toHaveBeenCalledWith(
      cacheKeys.scenarios(),
      scenarios,
      CACHE_TTL.scenario,
    );
  });

  it('keeps scenario IDs isolated in cache', async () => {
    cache.get.mockImplementation((key: string) =>
      key === cacheKeys.scenario('one')
        ? Promise.resolve({ id: 'one' })
        : undefined,
    );
    prisma.scenario.findUnique.mockResolvedValue({ id: 'two' });

    await expect(service.findById('one')).resolves.toEqual({ id: 'one' });
    await expect(service.findById('two')).resolves.toEqual({ id: 'two' });
    expect(prisma.scenario.findUnique).toHaveBeenCalledTimes(1);
  });

  it('falls back to Prisma when Redis is unavailable', async () => {
    cache.get.mockRejectedValue(new Error('redis unavailable'));
    cache.set.mockRejectedValue(new Error('redis unavailable'));
    prisma.scenario.findMany.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);
  });
});
