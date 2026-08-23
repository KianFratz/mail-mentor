import type { SessionStatus } from "@/types/conversation.type";

export const statusStyles: Record<SessionStatus, string> = {
  in_progress: "bg-amber-50 text-amber-700 border border-amber-200",
  graded: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  abandoned: "bg-slate-100 text-slate-600 border border-slate-200",
};
