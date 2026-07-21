import api from "@/lib/axios";
import type { WritingSession } from "@/types/conversation.type";
import { useEffect, useMemo, useState } from "react";
import CreateCompose from "@/components/conversation/CreateCompose";
import { getUserInitials } from "@/lib/utils";
import { replace, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { useConversationStore } from "@/store/conversation.store";

export function Conversation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSessionState] = useState<WritingSession | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const navigate = useNavigate();
  const { setScenario, setSubject, setStatus, setSession, setMessages, setWordCount, setTextBody, setFeedback } = useConversationStore();

  const userInitials = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return getUserInitials(token);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      navigate("/conversations", { replace: true });
      return;
    }

    setLoading(true);
    api
      .get(`/writing-session/${sessionId}`)
      .then((res) => {
        const data = res.data;
        setSessionState(data);

        // Hydrating the Zustand store from fetched session
        setSession(data.id);
        setScenario(data.scenario);
        setSubject(data.subjectLine);
        setTextBody(data.textBody);
        setWordCount(data.wordCount);
        setStatus(data.status);
        setFeedback(data.sessionFeedback || data.feedback);
        if (data.messages) {
          const mappedMessages = data.messages.map((m: any) => ({
            id: m.id,
            role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
            content: m.content,
            timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
          }));
          setMessages(mappedMessages);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch session:", err);
        navigate("/conversations", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [
    sessionId,
    navigate,
    setSession,
    setScenario,
    setSubject,
    setTextBody,
    setWordCount,
    setStatus,
    setMessages,
  ]);

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center bg-[#F9FAFB]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <Button onClick={() => navigate("/conversations")}>
          Back to Conversations
        </Button>
        <CreateCompose />
      </div>
    </div>
  );
}
