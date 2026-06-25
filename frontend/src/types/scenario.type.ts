import type { Scenario } from "@/constants/conversion.constant";

export interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}
