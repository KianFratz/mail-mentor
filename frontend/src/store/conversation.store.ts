import type { SessionStatus } from "@/types/conversation.type";
import type { SessionFeedback } from "@/types/feedback.type";
import type { ChatMessage } from "@/types/reply-editor.type";
import type { Scenario } from "@/types/scenario.type";
import { create } from "zustand";

interface ConversationStore {
  sessionId?: string;
  messages: ChatMessage[];
  feedback: SessionFeedback | null;
  isStreaming: boolean;
  setSession: (id: string) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setFeedback: (feedback: SessionFeedback) => void;
  setStreaming: (streaming: boolean) => void;
  clear: () => void;
  scenario: Scenario | null;
  subject: string;
  textBody: string;
  wordCount: number;
  showFeedback: boolean;
  status: SessionStatus | null;
  setScenario: (s: Scenario) => void;
  setSubject: (s: string) => void;
  setTextBody: (b: string) => void;
  setWordCount: (n: number) => void;
  setShowFeedback: (v: boolean) => void;
  setStatus: (s: SessionStatus) => void;
  clearTextBody: () => void;
  textSelectorOpen: boolean;
  formatSelectorOpen: boolean;
  linkSelectorOpen: boolean;
  setTextSelectorOpen: (open: boolean) => void;
  setFormatSelectorOpen: (open: boolean) => void;
  setLinkSelectorOpen: (open: boolean) => void;
}

export const useConversationStore = create<ConversationStore>((set) => ({
  sessionId: undefined,
  messages: [],
  feedback: null,
  isStreaming: false,
  scenario: null,
  subject: "",
  textBody: "",
  wordCount: 0,
  showFeedback: false,
  status: null,
  textSelectorOpen: false,
  formatSelectorOpen: false,
  linkSelectorOpen: false,

  setSession: (id) =>
    set({
      sessionId: id,
    }),

  setMessages: (messages) =>
    set({
      messages,
    }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setFeedback: (feedback) =>
    set({
      feedback,
    }),

  setStreaming: (isStreaming) =>
    set({
      isStreaming,
    }),
  setScenario: (scenario) =>
    set({
      scenario,
    }),
  setSubject: (subject) =>
    set({
      subject,
    }),
  setTextBody: (textBody) =>
    set({
      textBody,
    }),
  setWordCount: (wordCount) =>
    set({
      wordCount,
    }),
  setShowFeedback: (showFeedback) =>
    set({
      showFeedback,
    }),
  setStatus: (status) =>
    set({
      status,
    }),

  clearTextBody: () =>
    set({
      textBody: "",
    }),

  setTextSelectorOpen: (textSelectorOpen) => set({ textSelectorOpen }),
  setFormatSelectorOpen: (formatSelectorOpen) => set({ formatSelectorOpen }),
  setLinkSelectorOpen: (linkSelectorOpen) => set({ linkSelectorOpen }),

  clear: () =>
    set({
      sessionId: undefined,
      messages: [],
      feedback: null,
      isStreaming: false,
      scenario: null,
      subject: "",
      textBody: "",
      wordCount: 0,
      showFeedback: false,
      status: null,
      textSelectorOpen: false,
      formatSelectorOpen: false,
      linkSelectorOpen: false,
    }),
}));
