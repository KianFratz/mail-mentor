interface CategoryScoreEntry {
  name: string;
  score: number;
  maxScore: number;
}

interface CategoryScoreConfig {
  category: string;
  threshold: number;
  minSessions: number;
}

interface OverallScoreConfig {
  threshold: number;
  minSessions: number;
}

interface EvaluationResult {
  progress: number;
  earned: boolean;
}

interface SessionCountConfig {
  sessions: number;
}

interface StreakConfig {
  days: number;
}

export function evaluateCategoryScore(
  recentFeedbacks: { categoryScores: CategoryScoreEntry[] }[],
  config: CategoryScoreConfig,
): EvaluationResult {
  const scores = recentFeedbacks
    .map(
      (f) =>
        f.categoryScores.find(
          (c) => c.name.toLowerCase() === config.category.toLowerCase(),
        )?.score,
    )
    .filter((s): s is number => typeof s === 'number');

  if (scores.length < config.minSessions) {
    // partial progress = how many sessions logged toward the minimum
    return {
      progress: Math.round((scores.length / config.minSessions) * 100),
      earned: false,
    };
  }

  const recent = scores.slice(0, config.minSessions);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

  return {
    progress: Math.min(100, Math.round((avg / config.threshold) * 100)),
    earned: avg >= config.threshold,
  };
}

export function evaluateOverallScore(
  recentFeedbacks: { overallScore: number }[],
  config: OverallScoreConfig,
): EvaluationResult {
  const scores = recentFeedbacks.map((f) => f.overallScore);

  if (scores.length < config.minSessions) {
    return {
      progress: Math.round((scores.length / config.minSessions) * 100),
      earned: false,
    };
  }

  const recent = scores.slice(0, config.minSessions);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

  return {
    progress: Math.min(100, Math.round((avg / config.threshold) * 100)),
    earned: avg >= config.threshold,
  };
}

export function evaluateSessionCount(
  totalSession: number,
  config: SessionCountConfig,
): EvaluationResult {
  const progress = Math.min(
    100,
    Math.round((totalSession / config.sessions) * 100),
  );

  return {
    progress,
    earned: totalSession >= config.sessions,
  };
}

export function evaluateStreak(
  currentStreak: number,
  config: StreakConfig,
): EvaluationResult {
  const progress = Math.min(
    100,
    Math.round((currentStreak / config.days) * 100),
  );

  return {
    progress,
    earned: currentStreak >= config.days,
  };
}
