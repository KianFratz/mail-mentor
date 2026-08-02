import { Card, CardContent } from "@/components/ui/card";
import { ScoreRing } from "./Scorering";

interface ScoreCardProps {
  score: number;
}

export function ScoreCard({ score }: ScoreCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col items-center gap-4 py-8">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Your Score
        </p>
        <ScoreRing score={score} />
      </CardContent>
    </Card>
  );
}
