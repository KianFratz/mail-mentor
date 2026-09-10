import { Button } from "@/components/ui/button";
import { statusLabels, statusStyles } from "@/constants/conversation.constant";
import api from "@/lib/axios";
import { htmlToPlainText } from "@/lib/html";
import type { WritingSession } from "@/types/conversation.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import emptyState from "../assets/undraw_empty_4zx0.png";
import { useSubscriptionStore } from "@/store/subscription.store";
import { Sparkles, ArrowRight } from "lucide-react";

function ConversationList() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<WritingSession[]>([]);
  const navigate = useNavigate();
  const { plan, fetchSubscription } = useSubscriptionStore();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await api.get("/writing-session/me");
        setConversations(response.data);
      } catch (error) {
        console.error("Failed fetching conversations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
    fetchSubscription();
  }, [fetchSubscription]);

  return (
    <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-primary leading-tight">
            Your Conversations
          </h1>
        </div>

        {plan === "free" && (
          <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white/20 backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <p className="text-sm font-bold">Free Plan Limit: 7-Day History</p>
                <p className="text-xs text-violet-100">
                  Free users can view history from the last 7 days. Upgrade to Pro for full unlimited history access.
                </p>
              </div>
            </div>
            <Button
              onClick={() => navigate("/pricing")}
              className="shrink-0 bg-white text-violet-700 hover:bg-violet-50 font-bold text-xs rounded-xl px-4 py-2 flex items-center gap-1.5 shadow-sm"
            >
              Upgrade to Pro
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-border shadow-sm min-h-[75vh]">
            <img src={emptyState} alt="" className="w-48 h-auto mx-auto mt-6 py-4" />
            <p className="text-sm text-foreground font-medium">
              No conversations found.
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Start a new scenario to see your conversations here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${statusStyles[conv.status]}`}
                    >
                      {statusLabels[conv.status] || conv.status.replace(/_/g, " ")}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {conv.subjectLine || "No Subject"}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-3 whitespace-pre-wrap">
                    {htmlToPlainText(conv.textBody) || "No content..."}
                  </p>

                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">
                        text_snippet
                      </span>
                      {conv.wordCount} words
                    </div>
                    {conv.scenario && (
                      <Button
                        onClick={() => navigate(`/conversation/${conv.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Continue
                        <span className="material-symbols-outlined text-[16px]">
                          arrow_forward
                        </span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ConversationList;
