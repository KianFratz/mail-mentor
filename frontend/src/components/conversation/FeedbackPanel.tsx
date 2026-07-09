import type { SessionFeedback } from "@/types/feedback.type";
import type { ChatMessage } from "@/types/reply-editor.type";
import React, { type JSX } from "react";

interface FeedbackPanelProps {
  feedback: SessionFeedback;
  messages: ChatMessage[];
  onBack: () => void;
}

function FeedbackPanel({
  feedback,
  messages,
  onBack,
}: FeedbackPanelProps): JSX.Element {
  return (
    <div>
      <h2>Feedback Panel</h2>

      <button onClick={onBack}>Back</button>

      {messages.map((message) => (
        <div key={message.id}>
          <strong>{message.role}</strong>
          <p>{message.content}</p>
        </div>
      ))}
    </div>
  );
}

export default FeedbackPanel;
