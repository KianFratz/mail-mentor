import { colorMap, levelColorMap } from "@/constants/scenario.constant";
import type { ScenarioCardProps } from "@/types/scenario.type";
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

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-gray-300 transition-all group flex flex-col h-full relative overflow-hidden ${
        locked
          ? "opacity-[0.85] cursor-not-allowed"
          : "hover:shadow-lg hover:-translate-y-1"
      }`}
    >
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
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`w-2 h-2 rounded-full transition-colors ${
                dot <= activeDots ? levelInfo.dot : "bg-slate-200"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {scenario.title}
      </h3>
      <p className="text-base text-muted-foreground mb-6 flex-grow">
        {scenario.description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span
          className={`${levelInfo.badge} px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${levelInfo.dot}`} />
          {scenario.level}
        </span>
        <Button
          onClick={handleScenarioSelect}
          disabled={locked}
          className={`p-3 pb-2 rounded-xl bg-primary text-primary-foreground transition-transform ${
            locked ? "opacity-50" : "group-hover:scale-110"
          }`}
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>

      {locked && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[1.5px] rounded-2xl">
          <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mb-3 shadow-sm">
            <span className="material-symbols-outlined text-slate-400 text-3xl">
              lock
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-700 text-center px-4">
            {scenario.level?.toLowerCase() === "intermediate"
              ? "Score 75+ on all Beginner scenarios to unlock"
              : "Score 75+ on all Intermediate scenarios to unlock"}
          </p>
        </div>
      )}
    </div>
  );
};
