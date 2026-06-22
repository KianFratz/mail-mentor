import { colorMap } from "@/constants/scenario.constant";
import type { ScenarioCardProps } from "@/types/scenario.type";

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  category,
  categoryColor,
  title,
  description,
  level,
}) => {
  const dotsMap = {
    Beginner: 1,
    Intermediate: 2,
    Advanced: 3,
  };
  const activeDots = dotsMap[level];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-300 hover:shadow-lg transition-all group flex flex-col h-full hover:-translate-y-1">
      <div className="flex justify-between items-start mb-4">
        <span
          className={`${colorMap[categoryColor]} px-3 py-1 rounded-full text-[12px] font-bold uppercase tracking-wider`}
        >
          {category}
        </span>
        <div className="flex gap-1">
          {[1, 2, 3].map((dot) => (
            <span
              key={dot}
              className={`w-2 h-2 rounded-full ${
                dot <= activeDots ? "bg-primary" : "bg-outline-variant"
              }`}
            ></span>
          ))}
        </div>
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-base text-muted-foreground mb-6 flex-grow">
        {description}
      </p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-xs font-medium text-muted-foreground uppercase">
          {level}
        </span>
        <button className="p-3 pb-2 rounded-xl bg-primary text-primary-foreground group-hover:scale-110 transition-transform">
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};