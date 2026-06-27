export interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
}

export interface Scenario {
  id: string | number;
  category: string;
  color: "blue" | "purple" | "green" | "orange";
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  aiPersona?: string;
  hrName: string;
  hrProfession: string;
  createdAt?: string;
  updatedAt?: string;
}
