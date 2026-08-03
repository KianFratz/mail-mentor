interface CategoryScoreEntry {
  name: string;
  score: number;
  maxScore;
}

function evaluateCategoryScore(
  recentFeedbacks: { categoryScores: CategoryScoreEntry[] }[],
  config: { category: string; threshold: number; minSessions: number },
) {
  const scores = recentFeedbacks
    .map((f) => f.categoryScores.find((c) => c.name === config.category)?.score)
    .filter((s): s is number => s !== undefined);

  if (scores.length < config.minSessions) {
    // partial progress = how many sessions logged toward the minimum
    return {
      progress: Math.round((scores.length / config.minSessions) * 100),
      earned: false,
    };
  }

  const recent = scores.slice(-config.minSessions);
  const avg = recent.reduce((a, b) => a + b, 0) / recent.length;

  return {
    progress: Math.min(100, Math.round((avg / config.threshold) * 100)),
    earned: avg >= config.threshold,
  };
}
