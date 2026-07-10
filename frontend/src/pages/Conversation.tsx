import api from "@/lib/axios";
import type { WritingSession } from "@/types/conversation.type";
import { useEffect, useState } from "react";
import CreateCompose from "@/components/conversation/CreateCompose";
import { getUserInitials } from "@/lib/utils";

function Conversation() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<WritingSession[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<WritingSession | null>(null);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await api.get("/writing-session/me");
      setConversations(response.data);

    } catch (error) {
      console.error("Failed fetching conversations ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [])

  if (selectedConversation && selectedConversation.scenario) {
    const token = localStorage.getItem("access_token");
    const userInitials = getUserInitials(token);

    return (
      <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
        <div className="max-w-5xl mx-auto py-8 px-2">
          <button
            onClick={() => setSelectedConversation(null)}
            className="flex items-center gap-2 px-4 py-2 mb-6 bg-secondary text-secondary-foreground rounded-lg shadow hover:bg-secondary/80 transition-all text-sm font-medium"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Conversations
          </button>
          <CreateCompose
            scenario={selectedConversation.scenario}
            initialSubject={selectedConversation.subjectLine}
            initialTextBody=""
            sessionId={selectedConversation.id}
            userName={userInitials}
            writingSessionStatus={selectedConversation.status}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <h1 className="text-2xl font-bold text-primary mb-2 leading-tight mb-6">Your Conversations</h1>
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-border shadow-sm">
            <p className="text-lg text-muted-foreground">No conversations found.</p>
            <p className="text-sm text-muted-foreground mt-2">Start a new scenario to see your conversations here.</p>
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
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full uppercase tracking-wider">
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
                    dangerouslySetInnerHTML={{ __html: conv.textBody || "No content..." }}
                  />
                  
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <span className="material-symbols-outlined text-[16px]">text_snippet</span>
                      {conv.wordCount} words
                    </div>
                    {conv.scenario && (
                      <button 
                        onClick={() => setSelectedConversation(conv)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        Continue
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </button>
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

export default Conversation;
