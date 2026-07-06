import type { MessageRole } from "@/types/reply-editor.type";

export function Avatar({ initials, role }: { initials: string; role: MessageRole }) {
  const isAi = role === "ai";
  return (
    <div
      className={`
        flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center
        text-xs font-bold tracking-wide select-none
        ${isAi
          ? "bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-md shadow-violet-200"
          : "bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-md shadow-slate-200"
        }
      `}
    >
      {initials}
    </div>
  );
}