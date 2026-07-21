import React, { useEffect, useMemo } from "react";
import CreateCompose from "./CreateCompose";
import type { Scenario } from "@/types/scenario.type";
import { useLocation, useNavigate, useParams } from "react-router";
import { useConversationStore } from "@/store/conversation.store";

function NewConversation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { setScenario } = useConversationStore();

  const newScenario = (location.state as { scenario?: Scenario } | null)
    ?.scenario;

  useEffect(() => {
    if (newScenario) {
      setScenario(newScenario);
    } else {
      navigate("/scenarios", { replace: true });
    }
  }, [newScenario]);

  if (!newScenario) {
    navigate("/conversations", { replace: true });
  }

  return (
    <div className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <CreateCompose />
      </div>
    </div>
  );
}

export default NewConversation;
