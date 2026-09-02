export const PLAN_LIMITS = {
  free: {
    aiRepliesPerDay: 5,
    feedbacksPerDay: 1,
    maxHistoryDays: 7,
    maxRecentScores: 3,
    maxBadges: 3,
    allowedLevels: ['beginner'],
    exportEnabled: false,
    priorityAi: false,
  },
  pro: {
    aiRepliesPerDay: Infinity,
    feedbacksPerDay: Infinity,
    maxHistoryDays: Infinity,
    maxRecentScores: Infinity,
    maxBadges: Infinity,
    allowedLevels: ['beginner', 'intermediate', 'advanced'],
    exportEnabled: true,
    priorityAi: true,
  },
} as const;
