import { Button } from "@/components/ui/button";
import api from "@/lib/axios";
import type { SessionStatus, WritingSession } from "@/types/conversation.type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const statusStyles: Record<SessionStatus, string> = {
  draft: "bg-amber-50 text-amber-700 border border-amber-200",
  submitted: "bg-blue-50 text-blue-700 border border-blue-200",
  graded: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  abandoned: "bg-slate-100 text-slate-600 border border-slate-200",
};

function ConversationList() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<WritingSession[]>([]);
  const navigate = useNavigate();

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
  }, []);

  return (
    <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <h1 className="text-2xl font-bold text-primary mb-2 leading-tight mb-6">
          Your Conversations
        </h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-border shadow-sm">
            <p className="text-lg text-muted-foreground">
              No conversations found.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
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
                      {conv.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {new Date(conv.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {conv.subjectLine || "No Subject"}
                  </h3>
                  <div
                    className="text-sm text-slate-500 mb-6 line-clamp-3 prose prose-sm prose-slate"
                    dangerouslySetInnerHTML={{
                      __html: conv.textBody || "No content...",
                    }}
                  />

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
