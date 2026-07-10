import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { statusForScore } from "@/types/feedback.type";
import { STATUS_COLOR } from "@/constants/feedback.constant";

interface ScoreRingProps {
  score: number; 
  size?: number; 
  strokeWidth?: number;
  className?: string;
  label?: string; 
}

export function ScoreRing({
  score,
  size = 160,
  strokeWidth = 12,
  className,
  label = "/ 100",
}: ScoreRingProps) {
  const clamped = Math.max(0, Math.min(100, score));
  const [animatedScore, setAnimatedScore] = useState(0);
  const prefersReducedMotion = useRef(
    typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setAnimatedScore(clamped);
      return;
    }
    const raf = requestAnimationFrame(() => setAnimatedScore(clamped));
    return () => cancelAnimationFrame(raf);
  }, [clamped]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;
  const status = statusForScore(clamped);

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Score: ${clamped} out of 100`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", STATUS_COLOR[status])}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-bold tabular-nums leading-none">{Math.round(animatedScore)}</span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>
    </div>
  );
}