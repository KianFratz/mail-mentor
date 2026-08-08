import React, { type JSX } from "react";
import { ScoreCard } from "./Scorecard";
import { CategoryBreakdown } from "./CategoryBreakdown";
import { StrengthsAndImprovements } from "./StrengthsAndImprovements";
import { RevisionDiff } from "./Revisiondiff";
import { useConversationStore } from "@/store/conversation.store";

export function FeedbackPanel(): JSX.Element {
  const { feedback } = useConversationStore();

  if (!feedback) {
    return <FeedbackPanelEmpty />;
  }

  return (
    <div className={"space-y-6 max-w-3xl mx-auto"}>
      <ScoreCard
        score={feedback.overallScore}
      />
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
