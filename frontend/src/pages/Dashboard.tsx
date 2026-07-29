import BadgesCard from "@/BadgesCard";
import AIAdviceCard from "@/components/AIAdviceCard";
import PracticeStreakCard from "@/components/PracticeStreakCard";
import RecentScoresCard from "@/components/RecentScoreCard";
import SkillProficiencyCard from "@/components/SkillProficiencyCard";
import { DashboardData } from "@/constants/dashboard-layout.constant";
import { useSkillProficiencyStore } from "@/store/skill-proficiency.store";
import { useEffect } from "react";

export default function Dashboard() {
  const props = DashboardData;

  const response = useSkillProficiencyStore(
    (state) => state.fetchSkillProficiency,
  );

  useEffect(() => {
    response();
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 px-2">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-foreground leading-tight text-primary">
          Welcome back, {props.userName}.
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{props.subtitle}</p>
      </div>

      <AIAdviceCard {...props.aiSuggestion} />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        <SkillProficiencyCard />
        <PracticeStreakCard
          days={props.streakDays}
          message={props.streakMessage}
          weekDays={props.weekDays}
        />
      </div>

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

    </div>
  );
}
