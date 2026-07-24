import api from "@/lib/axios";
import { useEffect, useMemo, useState } from "react";
import CreateCompose from "@/components/conversation/CreateCompose";
import { useLocation, useNavigate, useParams } from "react-router";
import { useConversationStore } from "@/store/conversation.store";
import type { Scenario } from "@/types/scenario.type";

export function Conversation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [loading, setLoading] = useState(!!sessionId);
  const navigate = useNavigate();
  const location = useLocation();
  const newScenario = (location.state as { scenario: Scenario } | null)
    ?.scenario;
  const {
    setScenario,
    setSubject,
    setStatus,
    setSession,
    setMessages,
    setWordCount,
    setTextBody,
    setFeedback,
    setShowFeedback,
    clear,
  } = useConversationStore();

  useEffect(() => {
    // Existing conversation
    if (sessionId) {
      setLoading(true);
      setShowFeedback(false);

      api
        .get(`/writing-session/${sessionId}`)
        .then((res) => {
          const data = res.data;

          // Hydrating the Zustand store from fetched session
          setSession(data.id);
          setScenario(data.scenario);
          setSubject(data.subjectLine);
          setStatus(data.status);
          setFeedback(data.sessionFeedback || data.feedback);
          setShowFeedback(false);

          if (data.messages && data.messages.length > 0) {
            const mappedMessages = data.messages.map((m: any) => ({
              id: m.id,
              role: m.role.toLowerCase() === "user" ? "user" : "ai",
              content: m.content,
              timestamp: m.createdAt ? new Date(m.createdAt) : new Date(),
            }));
            setMessages(mappedMessages);
            setTextBody("");
            setWordCount(0);
          } else {
            setTextBody(data.textBody || "");
            setWordCount(data.wordCount || 0);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch session:", err);
          navigate("/conversations", { replace: true });
        })
        .finally(() => setLoading(false));

      return;
    }

    // Start new conversation
    if (!newScenario) {
      navigate("/scenarios", {
        replace: true,
      });

      return;
    }

    clear();
    setScenario(newScenario);
  }, [
    sessionId,
    newScenario,
    navigate,
    setSession,
    setScenario,
    setSubject,
    setStatus,
    setTextBody,
    setWordCount,
    setMessages,
    setFeedback,
    setShowFeedback,
    clear,
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
        <CreateCompose />
      </div>
    </div>
  );
}
