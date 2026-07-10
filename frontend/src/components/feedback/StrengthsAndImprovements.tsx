import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StrengthsAndImprovementsProps {
  strengths: string[];
  improvements: string[];
}

export function StrengthsAndImprovements({
  strengths,
  improvements,
}: StrengthsAndImprovementsProps) {
  return (
    <Card>
      <CardContent className="grid gap-6 py-6 sm:grid-cols-2">
        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Strengths
          </p>
          <ul className="space-y-2">
            {strengths.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
            Areas for Improvement
          </p>
          <ul className="space-y-2">
            {improvements.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground shrink-0 mt-1.5" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}