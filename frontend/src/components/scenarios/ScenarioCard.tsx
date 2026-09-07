import { colorMap, levelColorMap } from "@/constants/scenario.constant";
import type { ScenarioCardProps } from "@/types/scenario.type";
import { ArrowRight, Lock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onSelect,
  locked = false,
  planLocked = false,
  onUpgradePrompt,
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

  const isCardDisabled = locked || planLocked;

  const handleScenarioSelect = () => {
    if (planLocked) {
      if (onUpgradePrompt) onUpgradePrompt();
      return;
    }
    if (locked) return;

    if (onSelect) {
      onSelect(scenario);
    }
    navigate("/conversation", {
      state: { scenario },
    });
  };

  const unlockMessage = planLocked
    ? `Upgrade to Pro to unlock ${scenario.level} level`
    : normalizedLevel === "intermediate"
      ? "Score 75+ on all Beginner scenarios"
      : "Score 75+ on all Intermediate scenarios";

  return (
    <div
      onClick={planLocked ? handleScenarioSelect : undefined}
      className={`bg-white rounded-2xl border border-gray-300 transition-all group flex flex-col h-full relative overflow-hidden ${
        isCardDisabled ? (planLocked ? "cursor-pointer hover:border-violet-300 hover:shadow-md" : "cursor-not-allowed") : "hover:shadow-lg hover:-translate-y-1"
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
            {planLocked ? (
              <span className="flex items-center gap-1 text-[10px] font-extrabold text-violet-600 uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400" />
                PRO
              </span>
            ) : locked ? (
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
        {isCardDisabled ? (
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
        {isCardDisabled && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-b-2xl z-10 pointer-events-none" />
        )}

        <div className="px-6 pb-6 pt-2 flex flex-col gap-3">
          {planLocked ? (
            <>
              <div className="relative z-20 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 text-violet-800 text-sm font-semibold shadow-xs">
                <Sparkles className="w-4 h-4 shrink-0 text-amber-500 fill-amber-400" />
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
                  onClick={handleScenarioSelect}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-violet-200 hover:opacity-90"
                >
                  Upgrade
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </>
          ) : locked ? (
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
