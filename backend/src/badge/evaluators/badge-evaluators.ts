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

export interface EvaluationResult {
  progress: number;
  earned: boolean;
}

interface SessionCountConfig {
  sessions: number;
}

interface StreakConfig {
  days: number;
}

interface ImprovementConfig {
  increase: number;
}

interface PerfectScoreConfig {
  score: number;
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
  totalSessions: number,
  config: SessionCountConfig,
): EvaluationResult {
  const progress = Math.min(
    100,
    Math.round((totalSessions / config.sessions) * 100),
  );
  return {
    progress,
    earned: totalSessions >= config.sessions,
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

export function evaluateImprovement(
  recentFeedbacks: { overallScore: number }[],
  config: ImprovementConfig,
): EvaluationResult {
  if (recentFeedbacks.length < 2) {
    return { progress: 0, earned: false };
  }

  const latestScore = recentFeedbacks[0].overallScore;
  const pastScores = recentFeedbacks.slice(1).map((f) => f.overallScore);
  const minPastScore = Math.min(...pastScores);
  const diff = latestScore - minPastScore;

  if (diff <= 0) {
    return { progress: 0, earned: false };
  }

  const progress = Math.min(100, Math.round((diff / config.increase) * 100));
  return {
    progress,
    earned: diff >= config.increase,
  };
}

export function evaluatePerfectScore(
  recentFeedbacks: { overallScore: number }[],
  config: PerfectScoreConfig,
): EvaluationResult {
  if (recentFeedbacks.length === 0) {
    return { progress: 0, earned: false };
  }

  const maxScore = Math.max(...recentFeedbacks.map((f) => f.overallScore));
  const progress = Math.min(100, Math.round((maxScore / config.score) * 100));

  return {
    progress,
    earned: maxScore >= config.score,
  };
}

