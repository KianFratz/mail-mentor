export type ScenarioColor = "blue" | "purple" | "green" | "orange";
export type ScenarioLevel = "beginner" | "intermediate" | "advanced" | string;

export interface ScenarioCardProps {
  scenario: Scenario;
  onSelect: (scenario: Scenario) => void;
  locked?: boolean;
}

export interface Scenario {
  id: string | number;
  category: string;
  color: ScenarioColor;
  title: string;
  description: string;
  level: ScenarioLevel;
  aiPersona?: AiPersona;
  createdAt?: string;
  updatedAt?: string;
}

export interface AiPersona {
  name: string;
  role: string;
  background: string;
  communicationStyle: string;
  goal: string;
  mode: string;
  personality: string;
}