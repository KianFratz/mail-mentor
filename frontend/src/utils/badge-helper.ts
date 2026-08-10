import type { Badge } from "@/store/badge.store";

export function getBadgeRequirementNote(badge: Badge): string {
  const { criteriaType, criteriaConfig, subTitle } = badge;

  switch (criteriaType) {
    case "session_count":
      if (criteriaConfig?.sessions) {
        return `Complete ${criteriaConfig.sessions} writing session${
          criteriaConfig.sessions > 1 ? "s" : ""
        } to accomplish this badge.`;
      }
      break;
    case "streak":
      if (criteriaConfig?.days) {
        return `Maintain a ${criteriaConfig.days}-day practice streak to accomplish this badge.`;
      }
      break;
    case "category_score":
      if (criteriaConfig?.category && criteriaConfig?.threshold) {
        return `Score at least ${criteriaConfig.threshold}% in ${criteriaConfig.category} across ${
          criteriaConfig.minSessions || 1
        } session${(criteriaConfig.minSessions || 1) > 1 ? "s" : ""}.`;
      }
      break;
    case "overall_score":
      if (criteriaConfig?.threshold) {
        return `Maintain an overall average score of ${criteriaConfig.threshold}% across ${
          criteriaConfig.minSessions || 1
        } session${(criteriaConfig.minSessions || 1) > 1 ? "s" : ""}.`;
      }
      break;
    case "improvement":
      if (criteriaConfig?.increase) {
        return `Improve your overall writing score by ${criteriaConfig.increase} points.`;
      }
      break;
    case "perfect_score":
      return `Achieve a perfect score of 100 on any writing session.`;
  }

  return subTitle || "Complete the requirement to accomplish this badge.";
}
