import BadgesCard from "@/BadgesCard";
import AIAdviceCard from "@/components/AIAdviceCard";
import PracticeStreakCard from "@/components/PracticeStreakCard";
import RecentScoresCard from "@/components/RecentScoreCard";
import SkillProficiencyCard from "@/components/SkillProficiencyCard";
import { sampleDashboardData } from "@/constants/dashboard-mock-data";

export default function Dashboard() {
  const props = sampleDashboardData;

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      {/* Welcome header */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-foreground leading-tight">
          Welcome back, {props.userName}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{props.subtitle}</p>
      </div>

      {/* Top row: skill proficiency (wide) + streak (narrow) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <SkillProficiencyCard
          overallScore={props.overallScore}
          skills={props.skills}
        />
        <PracticeStreakCard
          days={props.streakDays}
          message={props.streakMessage}
          weekDays={props.weekDays}
        />
      </div>

      {/* Bottom row: recent scores + badges */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
        <RecentScoresCard
          scores={props.recentScores}
          onViewAll={props.onViewAllScores}
        />
        <BadgesCard
          badges={props.earnedBadges}
          lockedBadge={props.lockedBadge}
        />
      </div>

      {/* AI advice banner */}
      <AIAdviceCard {...props.aiSuggestion} />
    </div>
  );
}
