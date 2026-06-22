import CompositionArea from "@/components/conversation/CompositionArea";
import ReviewPanel from "@/components/conversation/ReviewPanel";

function Conversation() {
  return (
    <div className="flex h-full -mx-6 -my-2 overflow-hidden">
      <CompositionArea />
      <ReviewPanel />
    </div>
  );
}

export default Conversation;
