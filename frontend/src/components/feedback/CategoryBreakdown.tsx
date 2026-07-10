import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Progress } from "../ui/progress";
import { IssueCard } from "./IssueCard";
import { statusForScore, type CategoryFeedback } from "@/types/feedback.type";
import { STATUS_BAR_CLASS, STATUS_ICON, STATUS_ICON_CLASS } from "@/constants/feedback.constant";

interface CategoryRowProps {
  category: CategoryFeedback;
  expanded: boolean;
  onToggle: () => void;
}

function CategoryRow({ category, expanded, onToggle }: CategoryRowProps) {
  const status = statusForScore(category.score);
  const Icon = STATUS_ICON[status];
  const hasIssues = category.issues.length > 0;

  return (
    <div className="border-b last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        disabled={!hasIssues}
        aria-expanded={expanded}
        className={cn(
          "w-full flex items-center gap-3 py-3 px-1 text-left transition-colors",
          hasIssues && "hover:bg-muted/50 cursor-pointer",
          !hasIssues && "cursor-default"
        )}
      >
        <Icon className={cn("h-4 w-4 shrink-0", STATUS_ICON_CLASS[status])} aria-hidden />
        <span className="text-sm font-medium flex-1">{category.name}</span>
        <span className="text-sm tabular-nums text-muted-foreground w-16 text-right">
          {category.score}/100
        </span>
        <Progress value={category.score} className={cn("w-20 h-2", STATUS_BAR_CLASS[status])} />
        {hasIssues && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
              expanded && "rotate-180"
            )}
            aria-hidden
          />
        )}
      </button>

      {expanded && hasIssues && (
        <div className="pb-4 pl-7 pr-1 space-y-3">
          {category.issues.map((issue) => (
            <IssueCard key={issue.messageIndex} issue={issue} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CategoryBreakdownProps {
  categories: CategoryFeedback[];
  defaultExpandedId?: string;
}

export function CategoryBreakdown({ categories, defaultExpandedId }: CategoryBreakdownProps) {
  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId ?? null);

  return (
<Card>
      <CardHeader>
        <CardTitle className="text-base">Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {categories.map((category,) => (
          <CategoryRow
            key={category.name}
            category={category}
            expanded={expandedId === category.name}
            onToggle={() => setExpandedId((cur) => (cur === category.name ? null : category.name))}
          />
        ))}
      </CardContent>
    </Card>
  );
}