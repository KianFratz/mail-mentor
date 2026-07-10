import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedbackIssue } from "@/types/feedback.type";
import { SEVERITY_META } from "@/constants/feedback.constant";

interface IssueCardProps {
  issue: FeedbackIssue;
}

export function IssueCard({ issue }: IssueCardProps) {
  const meta = SEVERITY_META[issue.severity];

  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} aria-hidden />
        <span className={meta.badge}>{meta.label}</span>
        <span className="text-muted-foreground">— Message #{issue.messageIndex}</span>
      </div>

      <div className="border-l-2 border-muted pl-3">
        <p className="text-xs text-muted-foreground mb-1">Your text:</p>
        <p className="text-sm italic text-foreground/90">"{issue.excerpt}"</p>
      </div>

      <p className="text-sm">
        <span className="font-medium">Problem: </span>
        <span className="text-muted-foreground">{issue.issue}</span>
      </p>

      <div className="rounded-md bg-emerald-50 dark:bg-emerald-950/30 p-3 space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          <Sparkles className="h-3.5 w-3.5" />
          Suggestion
        </div>
        <p className="text-sm text-emerald-900 dark:text-emerald-200">{issue.suggestion}</p>
      </div>
    </div>
  );
}