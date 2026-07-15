import React, { useRef } from "react";
import { MessageBubble } from "../MessageBubble";
import { TypingIndicator } from "../TypingIndicator";
import type { ChatMessage } from "@/types/reply-editor.type";

interface DisplayMessageProps {
  messages: ChatMessage[];
  userInitials: string;
  aiInitials: string;
  isSending: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

function DisplayMessage({
  messages,
  userInitials,
  aiInitials,
  isSending,
  messagesEndRef,
}: DisplayMessageProps) {
  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-slate-50/60 min-h-[220px]">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-1">
            <span className="material-symbols-outlined text-violet-500 text-[22px]">
              forum
            </span>
          </div>
          <p className="text-sm font-medium text-slate-600">
            Start the conversation
          </p>
          <p className="text-xs text-slate-400 max-w-xs">
            Write your reply below and hit{" "}
            <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-sm">
              Send Reply
            </kbd>{" "}
            to get an AI response.
          </p>
        </div>
      )}

      {messages.map((msg) => (
        <MessageBubble
          key={msg.id}
          message={msg}
          userInitials={userInitials}
          aiInitials={aiInitials}
        />
      ))}

      {isSending && <TypingIndicator aiInitials={aiInitials} />}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default DisplayMessage;
