export type IssueSeverity = "minor" | "moderate" | "major";

export interface SessionFeedback {
    id: string;
    writingSessionId: string;
    overallScore: number;
    categoryScores: CategoryFeedback[];
    strengths: string[];
    improvements: string[];
    suggestedRevision: SuggestedRevision;
    createdAt: string;
}

export interface CategoryFeedback {
    name: string;
    score: number;
    issues: FeedbackIssue[];
    feedback: string;
    maxScore: number
}

export interface FeedbackIssue {
    issue: string;
    excerpt: string;
    severity: IssueSeverity;
    suggestion: string;
    messageIndex: number;
}

export interface SuggestedRevision {
    revised: string;
    original: string;
    explanation: string;
}