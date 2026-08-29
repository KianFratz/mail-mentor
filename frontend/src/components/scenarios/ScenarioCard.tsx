import { colorMap, levelColorMap } from "@/constants/scenario.constant";
import type { ScenarioCardProps } from "@/types/scenario.type";
import { ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onSelect,
  locked = false,
}) => {
  const dotsMap: Record<string, number> = {
    beginner: 1,
    intermediate: 2,
    advanced: 3,
    hard: 3,
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
    Hard: 3,
  };

  const normalizedLevel = scenario.level?.toLowerCase() || "beginner";
  const activeDots = dotsMap[scenario.level] || dotsMap[normalizedLevel] || 1;
  const levelInfo = levelColorMap[normalizedLevel] || levelColorMap.beginner;
  const navigate = useNavigate();

  const handleScenarioSelect = () => {
    if (locked) return;

    if (onSelect) {
      onSelect(scenario);
    }
    navigate("/conversation", {
      state: { scenario },
    });
  };

  const unlockMessage =
    normalizedLevel === "intermediate"
      ? "Score 75+ on all Beginner scenarios"
      : "Score 75+ on all Intermediate scenarios";

  return (
    <div
      className={`bg-white rounded-2xl border border-gray-300 transition-all group flex flex-col h-full relative overflow-hidden ${
        locked ? "cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className="p-6 pb-3">
        <div className="flex justify-between items-start mb-4">
          <span
            className={`${
              colorMap[scenario.color] || "bg-gray-100 text-gray-700"
            } px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider`}
          >
            {scenario.category}
          </span>
          <div
            className="flex gap-1.5 items-center px-2 py-1 bg-slate-50 rounded-full border border-slate-200/60"
            title={`Level: ${scenario.level}`}
          >
            {locked ? (
              <Lock className="w-3.5 h-3.5 text-slate-400" />
            ) : (
              [1, 2, 3].map((dot) => (
                <span
                  key={dot}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    dot <= activeDots ? levelInfo.dot : "bg-slate-200"
                  }`}
                />
              ))
            )}
          </div>
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {scenario.title}
        </h3>
        {locked ? (
          <div className="relative">
            <p className="text-base text-muted-foreground line-clamp-3">
              {scenario.description}
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-b from-transparent to-white pointer-events-none" />
          </div>
        ) : (
          <p className="text-base text-muted-foreground mb-6">
            {scenario.description}
          </p>
        )}
      </div>

      <div className="relative mt-auto">
        {locked && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-b-2xl z-10 pointer-events-none" />
        )}

        <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
          {locked ? (
            <>
              <div className="relative z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F9FAFB] border border-gray-300 text-slate-700 text-sm font-medium ">
                <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>{unlockMessage}</span>
              </div>

              <div className="relative z-20 flex items-center justify-between">
                <span
                  className={`${levelInfo.badge} px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${levelInfo.dot}`}
                  />
                  {scenario.level}
                </span>
                <Button
                  disabled
                  className="p-2 rounded-xl bg-primary text-primary-foreground opacity-60"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between">
              <span
                className={`${levelInfo.badge} px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${levelInfo.dot}`} />
                {scenario.level}
              </span>
              <Button
                onClick={handleScenarioSelect}
                className="p-2 rounded-xl bg-primary text-primary-foreground transition-transform group-hover:scale-110"
              >
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
