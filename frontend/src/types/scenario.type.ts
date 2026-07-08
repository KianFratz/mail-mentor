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
  level: "beginner" | "intermediate" | "advanced";
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