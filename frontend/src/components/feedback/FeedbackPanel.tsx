import type { SessionFeedback } from "@/types/feedback.type";
import type { ChatMessage } from "@/types/reply-editor.type";
import React, { type JSX } from "react";
import { ScoreCard } from "./Scorecard";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { StrengthsAndImprovements } from "./StrengthsAndImprovements";
import { RevisionDiff } from "./Revisiondiff";

interface FeedbackPanelProps {
  feedback: SessionFeedback;
  messages: ChatMessage[];
  onBack: () => void;
  className?: string;
}

export function FeedbackPanel({
  feedback,
  messages,
  onBack,
  className,
}: FeedbackPanelProps): JSX.Element {
  return (
    <div className={className ?? "space-y-6 max-w-3xl mx-auto"}>
      <ScoreCard score={feedback.overallScore} overallScore={feedback.overallScore} />
      <CategoryBreakdown categories={feedback.categoryScores} />
      <StrengthsAndImprovements
        strengths={feedback.strengths}
        improvements={feedback.improvements}
      />
      <RevisionDiff revision={feedback.suggestedRevision} />
    </div>
  );
}

export function FeedbackPanelSkeleton() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto animate-pulse">
      <div className="h-56 rounded-lg bg-muted" />
      <div className="h-64 rounded-lg bg-muted" />
      <div className="h-40 rounded-lg bg-muted" />
      <div className="h-56 rounded-lg bg-muted" />
    </div>
  );
}

export function FeedbackPanelEmpty({ message }: { message?: string }) {
  return (
    <div className="max-w-3xl mx-auto rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
      {message ?? "Feedback for this session isn't available yet."}
    </div>
  );
}