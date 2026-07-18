import type { ChatMessage } from "@/types/reply-editor.type";
import { Avatar } from "./Avatar";

export function MessageBubble({
  message,
  userInitials,
  aiInitials,
}: {
  message: ChatMessage;
  userInitials: string;
  aiInitials: string;
}) {
  const isUser = message.role === "user";
  const initials = isUser ? userInitials : aiInitials;
  const time = message.timestamp.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`flex items-end gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-fade-in`}
    >
      <Avatar initials={initials} role={message.role} />
      <div
        className={`max-w-[75%] flex flex-col ${isUser ? "items-end" : "items-start"}`}
      >
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm
            ${
              isUser
                ? "bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-sm"
                : "bg-white border border-slate-200 text-slate-800 rounded-bl-sm"
            }
          `}
        >
          {isUser ? (
            <div
              className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap [&>p]:my-2 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: message.content }}
            />
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>
        <span className="text-[10px] text-slate-400 mt-1 px-1">{time}</span>
      </div>
    </div>
  );
}
