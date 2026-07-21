import api from "@/lib/axios";
import type { WritingSession } from "@/types/conversation.type";
import { useEffect, useMemo, useState } from "react";
import CreateCompose from "@/components/conversation/CreateCompose";
import { getUserInitials } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import { useConversationStore } from "@/store/conversation.store";

export function Conversation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<WritingSession | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const navigate = useNavigate();
  const setScenario = useConversationStore((state) => state.setScenario);
  const setSubject = useConversationStore((state) => state.setSubject);
  const setStatus = useConversationStore((state) => state.setStatus);

  const userInitials = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return getUserInitials(token);
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    setLoading(true);
    api
      .get(`/writing-session/${sessionId}`)
      .then((res) => {
        const data = res.data;
        setSession(data);

        setScenario(data.scenario);
        setSubject(data.subject);
        setStatus(data.status);
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
    useConversationStore.setScenario,
    useConversationStore.setSubject,
    useConversationStore.setStatus,
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
