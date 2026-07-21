

export type MessageRole = "user" | "ai";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export interface ReplyEditorProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
}
