import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "./Scorering";

interface ScoreCardProps {
  score: number;
  overallScore: number;
}

export function ScoreCard({ score, overallScore }: ScoreCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center gap-4 py-8">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Your Score
        </p>
        <ScoreRing score={score} />
        <p className="text-center text-sm text-muted-foreground max-w-sm">{overallScore}</p>
      </CardContent>
    </Card>
  );
}