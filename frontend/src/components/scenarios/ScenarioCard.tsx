import { colorMap, levelColorMap } from "@/constants/scenario.constant";
import type { ScenarioCardProps } from "@/types/scenario.type";
import { useNavigate } from "react-router";
import { Button } from "../ui/button";

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onSelect,
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
    if (onSelect) {
      onSelect(scenario);
    }
    navigate("/conversation", {
      state: { scenario },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-all group flex flex-col h-full hover:-translate-y-1">
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
          className="p-3 pb-2 rounded-xl bg-primary text-primary-foreground group-hover:scale-110 transition-transform"
        >
          <span className="material-symbols-outlined">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
};
