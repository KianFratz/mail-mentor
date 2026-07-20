import api from "@/lib/axios";
import type { WritingSession } from "@/types/conversation.type";
import { useEffect, useMemo, useState } from "react";
import CreateCompose from "@/components/conversation/CreateCompose";
import { getUserInitials } from "@/lib/utils";
import { useLocation, useNavigate, useParams } from "react-router";
import { Button } from "../ui/button";
import type { Scenario } from "@/types/scenario.type";

export function Conversation() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [session, setSession] = useState<WritingSession | null>(null);
  const [loading, setLoading] = useState(!!sessionId);
  const location = useLocation();
  const navigate = useNavigate();

  const userInitials = useMemo(() => {
    const token = localStorage.getItem("access_token");
    return getUserInitials(token);
  }, []);

  const newScenario = (location.state as { scenario?: Scenario } | null)
    ?.scenario;

  useEffect(() => {
    if (!session) return;
    setLoading(true);

    api
      .get(`/writing-session/${sessionId}`)
      .then((res) => setSession(res.data))
      .catch((err) => {
        console.error("Failed to fetch session:", err);
        navigate("/conversations", { replace: true });
      })
      .finally(() => setLoading(false));
  }, [sessionId, navigate]);

  if (sessionId) {
    if (!session || !session.scenario) return null; // or a loading state

    return (
      <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
        <div className="max-w-5xl mx-auto py-8 px-2">
          <Button onClick={() => navigate("/conversations")}>
            Back to Conversations
          </Button>
          <CreateCompose
            scenario={session.scenario}
            initialSubject={session.subjectLine}
            initialTextBody=""
            sessionId={session.id}
            userName={userInitials}
            writingSessionStatus={session.status}
            onSessionCreated={(id) =>
              navigate(`/conversation/${id}`, { replace: true })
            }
          />
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!sessionId && !newScenario) {
      navigate("/conversations", { replace: true });
      return null;
    }
  }, [sessionId, newScenario, navigate]);

  if (!sessionId && !newScenario) {
    return null;
  }

  return (
    <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <CreateCompose
          scenario={newScenario}
          initialSubject=""
          initialTextBody=""
          sessionId={undefined}
          userName={userInitials}
          writingSessionStatus={undefined}
          onSessionCreated={(id) =>
            navigate(`/conversation/${id}`, { replace: true })
          }
        />
      </div>
    </div>
  );
}
