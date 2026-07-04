export type SessionStatus = "draft" | "submitted" | "graded" | "abandoned";

export interface WritingSession {
    id: string;
    userId: string;
    status: SessionStatus;
    subjectLine: string;
    textBody: string;
    wordCount: number;
    scenarioId: string;
    createdAt: string;
    updatedAt: string;
}