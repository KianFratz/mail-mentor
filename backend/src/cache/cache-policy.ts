import { Logger } from '@nestjs/common';
import type { Cache } from 'cache-manager';
import { randomUUID } from 'crypto';

export const CACHE_TTL = {
  scenario: 60 * 60 * 1000,
  dashboard: 5 * 60 * 1000,
  recentScoresGeneration: 60 * 60 * 1000,
} as const;

export const cacheKeys = {
  scenarios: () => 'scenarios:all',
  scenario: (scenarioId: string) => `scenario:${scenarioId}`,
  unlockedLevels: (userId: string) => `unlocked-levels:${userId}`,
  skillProficiency: (userId: string) => `skill-proficiency:${userId}`,
  userBadges: (userId: string) => `badges:user:${userId}`,
  recentScoresGeneration: (userId: string) =>
    `recent-scores:${userId}:generation`,
  recentScores: (
    userId: string,
    generation: string,
    limit: number,
    page: number,
  ) =>
    `recent-scores:${userId}:generation:${generation}:limit:${limit}:page:${page}`,
};

type CacheResult<T> =
  | { hit: true; value: T }
  | { hit: false; value?: undefined };

export async function safeCacheGet<T>(
  cache: Cache,
  key: string,
  cacheName: string,
  logger: Logger,
): Promise<CacheResult<T>> {
  try {
    const value = await cache.get<T>(key);
    const hit = value !== undefined && value !== null;
    logger.debug({ event: hit ? 'cache_hit' : 'cache_miss', cacheName });
    if (!hit) {
      logger.debug({ event: 'cache_database_fallback', cacheName });
    }
    return hit
      ? { hit: true, value: value as T }
      : { hit: false, value: undefined };
  } catch {
    logger.warn({ event: 'cache_get_error', cacheName });
    logger.debug({ event: 'cache_database_fallback', cacheName });
    return { hit: false, value: undefined };
  }
}

export async function safeCacheSet(
  cache: Cache,
  key: string,
  value: unknown,
  ttl: number,
  cacheName: string,
  logger: Logger,
): Promise<void> {
  try {
    await cache.set(key, value, ttl);
  } catch {
    logger.warn({ event: 'cache_set_error', cacheName });
  }
}

export async function safeCacheDelete(
  cache: Cache,
  key: string,
  cacheName: string,
  logger: Logger,
): Promise<void> {
  try {
    await cache.del(key);
  } catch {
    logger.warn({ event: 'cache_delete_error', cacheName });
  }
}

export async function getRecentScoresGeneration(
  cache: Cache,
  userId: string,
  logger: Logger,
): Promise<string> {
  const key = cacheKeys.recentScoresGeneration(userId);
  const cached = await safeCacheGet<string>(
    cache,
    key,
    'recent_scores_generation',
    logger,
  );
  if (cached.hit) return cached.value;

  const generation = randomUUID();
  await safeCacheSet(
    cache,
    key,
    generation,
    CACHE_TTL.recentScoresGeneration,
    'recent_scores_generation',
    logger,
  );
  return generation;
}

export async function rotateRecentScoresGeneration(
  cache: Cache,
  userId: string,
  logger: Logger,
): Promise<void> {
  await safeCacheSet(
    cache,
    cacheKeys.recentScoresGeneration(userId),
    randomUUID(),
    CACHE_TTL.recentScoresGeneration,
    'recent_scores_generation',
    logger,
  );
}
