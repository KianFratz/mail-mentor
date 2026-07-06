import { Avatar } from "./Avatar";

export function TypingIndicator({ aiInitials }: { aiInitials: string }) {
  return (
    <div className="flex items-end gap-3 animate-fade-in">
      <Avatar initials={aiInitials} role="ai" />
      <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="w-2 h-2 bg-violet-400 rounded-full animate-bounce"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}