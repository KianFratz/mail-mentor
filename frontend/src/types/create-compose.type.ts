import type { Scenario } from "./scenario.type";

export interface CreateComposeProps {
  scenario: Scenario;
  initialSubject?: string;
  initialTextBody?: string;
  sessionId?: string;
  userName?: string;
  writingSessionStatus?: string;
  onSessionCreated?: (sessionId: string) => void;
}
