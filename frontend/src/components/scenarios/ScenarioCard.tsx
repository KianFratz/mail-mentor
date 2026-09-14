import type { ScenarioCardProps } from "@/types/scenario.type";
import { ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

const categoryStyles = {
  blue: "border-blue-100 bg-blue-50/70 text-blue-700",
  purple: "border-violet-100 bg-violet-50/70 text-violet-700",
  green: "border-teal-100 bg-teal-50/70 text-teal-700",
  orange: "border-orange-100 bg-orange-50/70 text-orange-700",
};

const levelStyles: Record<string, string> = {
  beginner: "border-teal-100 bg-teal-50/70 text-teal-700",
  intermediate: "border-amber-100 bg-amber-50/70 text-amber-700",
  advanced: "border-rose-100 bg-rose-50/70 text-rose-700",
  hard: "border-rose-100 bg-rose-50/70 text-rose-700",
};

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onSelect,
  locked = false,
  planLocked = false,
  onUpgradePrompt,
}) => {
  const normalizedLevel = scenario.level?.toLowerCase() || "beginner";
  const levelStyle = levelStyles[normalizedLevel] || levelStyles.beginner;
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

  const scenarioMetadata = (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`${
          categoryStyles[scenario.color] ||
          "border-slate-100 bg-slate-50 text-slate-600"
        } rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide`}
      >
        {scenario.category}
      </span>
      <span
        className={`${levelStyle} rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide`}
      >
        {scenario.level}
      </span>
    </div>
  );

  return (
    <div
      onClick={planLocked ? handleScenarioSelect : undefined}
      className={`bg-white rounded-2xl border border-gray-300 transition-all group flex flex-col h-full relative overflow-hidden ${
        isCardDisabled
          ? planLocked
            ? "cursor-pointer hover:border-violet-300 hover:shadow-md"
            : "cursor-not-allowed"
          : "hover:shadow-lg hover:-translate-y-1"
      }`}
    >
      <div className={isCardDisabled ? "p-6 pb-3" : "p-6 pb-0"}>
        <h3 className="mb-3 text-2xl font-bold leading-tight text-foreground">
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
          <p className="text-base text-muted-foreground">
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
                <span>{unlockMessage}</span>
              </div>

              <div className="relative z-20 flex items-center justify-between gap-3">
                {scenarioMetadata}
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

              <div className="relative z-20 flex items-center justify-between gap-3">
                {scenarioMetadata}
                <Button
                  disabled
                  className="h-9 w-12 rounded-xl bg-primary p-0 text-primary-foreground opacity-60"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-3">
              {scenarioMetadata}
              <Button
                onClick={handleScenarioSelect}
                className="h-9 w-12 rounded-xl bg-primary p-0 text-primary-foreground transition-transform group-hover:scale-110"
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
