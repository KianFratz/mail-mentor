import CompositionArea from "@/components/conversation/CompositionArea";
import ReviewPanel from "@/components/conversation/ReviewPanel";
import type { Scenario } from "@/constants/conversion.constant";

interface ConversationProps {
  scenario: Scenario;
}

function Conversation({ scenario }: ConversationProps) {
  return (
    <div className="flex h-full -mx-6 -my-2 overflow-hidden">
      <CompositionArea />
      <ReviewPanel scenario={scenario} />
    </div>
  );
}

export default Conversation;
