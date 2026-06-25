import React, { useRef, useState } from "react";
import ReplyEditor from "./ReplyEditor";
import type { Scenario, ScenarioCardProps } from "@/types/scenario.type";

interface CreateComposeProps {
  scenario: Scenario
}

const CreateCompose = ({ scenario }: CreateComposeProps) => {
  const [wordCount, setWordCount] = useState(0);
  const [isPolishing, setIsPolishing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleMagicClick = () => {
    setIsPolishing(true);
    setTimeout(() => {
      setIsPolishing(false);
      if (editorRef.current) {
        editorRef.current.style.transition = "background-color 0.5s";
        editorRef.current.style.backgroundColor = "rgba(184, 156, 255, 0.1)";
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.style.backgroundColor = "transparent";
          }
        }, 1000);
      }
    }, 1500);
  };

  const handleSubmitReply = () => {};

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          To: {scenario.hr.name}
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{scenario.title}</h1>
          <p className="text-base text-muted-foreground mt-1">
            Description: {scenario.description}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-green-400 text-secondary-foreground rounded-full text-xs font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">
              check_circle
            </span>
            Professional Tone
          </span>
          <span className="px-4 py-3 bg-muted text-muted-foreground rounded-full text-xs font-medium">
            Word count: <span>{wordCount}</span>
          </span>
        </div>
      </div>
      <ReplyEditor
        onWordCountChange={setWordCount}
        editorRef={editorRef}
        onSubmitReply={handleSubmitReply}
      />
    </div>
  );
};

export default CreateCompose;
