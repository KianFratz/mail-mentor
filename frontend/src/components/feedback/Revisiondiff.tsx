import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SuggestedRevision } from "@/types/feedback.type";

interface RevisionDiffProps {
  revision: SuggestedRevision;
}

export function RevisionDiff({ revision }: RevisionDiffProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Suggested Revision</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x rounded-lg border overflow-hidden">
          <div className="p-4 bg-muted/30">
            <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase mb-2">
              Your Version
            </p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{revision.original}</p>
          </div>
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20">
            <p className="text-xs font-semibold tracking-widest text-emerald-700 dark:text-emerald-400 uppercase mb-2">
              Improved Version
            </p>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{revision.revised}</p>
          </div>
        </div>

        <div className="rounded-md bg-muted/50 p-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
            Why these changes?
          </p>
          <p className="text-sm text-foreground/90">{revision.explanation}</p>
        </div>
      </CardContent>
    </Card>
  );
}