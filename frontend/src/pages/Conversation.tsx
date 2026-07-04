import api from "@/lib/axios";
import type { WritingSession } from "@/types/conversation.type";
import { useEffect, useState } from "react";

function Conversation() {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState<WritingSession[]>([]);

  const fetchConversation = async () => {
    try {
      setLoading(true);
      const response = await api.get("/writing-session/me");
      setConversations(response.data);

      console.log("Fetched conversations:", response.data);
    } catch (error) {
      console.error("Failed fetching conversations ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversation();
  }, [])

  return (
    <div className="flex flex-col w-full px-6 py-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      {loading ? (
        <p>Loading...</p>
      ) : conversations.length === 0 ? (
        <p className="text-muted-foreground">No conversations found.</p>
      ) : (
        <ul className="space-y-3">
          {conversations.map((conv) => (
            <li key={conv.id} className="p-4 border border-border rounded-lg bg-card text-card-foreground shadow-sm">
              <p className="font-semibold text-lg">{conv.subjectLine}</p>
              <p className="text-sm text-muted-foreground">Status: {conv.status}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Conversation;
