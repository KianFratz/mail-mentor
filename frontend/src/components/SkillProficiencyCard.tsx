import type { SkillProficiency } from "@/types/dashboard.type";
import SkillBar from "./SkillBar";

interface SkillProficiencyCardProps {
  title?: string;
  overallScore: number;
  skills: SkillProficiency[];
}

export default function SkillProficiencyCard({
  title = "Skill Proficiency",
  overallScore,
  skills,
}: SkillProficiencyCardProps) {
  return (
    <div className="md:col-span-8 bg-white border border-border rounded-2xl p-6 shadow-xs flex flex-col gap-5">
      <div className="flex justify-between items-center">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-success/10 text-success border border-success/20">
          Overall: {overallScore}%
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
        {skills.map((skill) => (
          <SkillBar
            key={skill.name}
            name={skill.name}
            percentage={skill.percentage}
          />
        ))}
      </div>
    </div>
  );
}
