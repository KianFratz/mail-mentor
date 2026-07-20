import type { SessionFeedback } from "./feedback.type";

export type MessageRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ReplyEditorProps {
  onWordCountChange: (count: number) => void;
  onBodyChange: (body: string) => void;
  initialTextBody?: string;
  editorRef: React.RefObject<HTMLDivElement | null>;
  sessionId?: string;
  userName?: string;
  aiName?: string;
  onEndSession?: (feedback: SessionFeedback, messages: ChatMessage[]) => void;
  onStartSession?: () => Promise<string>;
  writingSessionStatus?: string;
  setShowFeedback: (value: boolean) => void;
  disableSend?: boolean;
}
