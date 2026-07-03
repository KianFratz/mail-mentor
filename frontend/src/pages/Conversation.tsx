import ReviewPanel from "@/components/conversation/ReviewPanel";
import type { Scenario } from "@/types/scenario.type";

interface ConversationProps {
  scenario: Scenario;
}

function Conversation({ scenario }: ConversationProps) {
  return (
    <div className="flex h-full -mx-6 -my-2 overflow-hidden">
      <ReviewPanel scenario={scenario} />
    </div>
  );
}

export default Conversation;
