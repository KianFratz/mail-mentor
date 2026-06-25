import React, { useRef, useState } from "react";
import ReplyEditor from "./ReplyEditor";
import ReviewPanel from "./ReviewPanel";
import type { Scenario } from "@/constants/conversion.constant";

interface CreateComposeProps {
  scenario: Scenario;
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
    <div className="flex h-full w-full overflow-hidden ">
      <section className="flex-1 bg-background overflow-y-auto relative px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">
                {scenario.title}
              </h1>
              <p className="text-base text-muted-foreground mt-1">
                Description: {scenario.description}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 font-sans selection:bg-emerald-100">
              <div className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full text-xs font-semibold shadow-sm transition-all duration-200 hover:bg-emerald-100/80">
                <span className="material-symbols-outlined text-[16px] text-emerald-600 scale-105">
                  check_circle
                </span>
                Professional Tone
              </div>
              <div className="flex items-center gap-1 px-3.5 py-2 bg-slate-50 text-slate-600 border border-slate-200/60 rounded-full text-xs font-medium shadow-sm">
                <span className="text-slate-400 font-normal mr-0.5">
                  Words:
                </span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {wordCount}
                </span>
              </div>
            </div>
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-secondary">
              <span className="text-sm text-muted-foreground w-14 shrink-0">
                To:
              </span>
              <div className="flex-1 flex items-center gap-2 text-sm text-muted-foreground">
                <span className="px-2.5 py-1 rounded-md font-medium">
                  {scenario.hr.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 px-4 py-3 border-b/50 border-border">
              <label
                htmlFor="subject"
                className="text-sm text-muted-foreground w-14 shrink-0"
              >
                Subject:
              </label>
              <input
                id="subject"
                type="text"
                placeholder="Example..."
                className="flex-1 bg-transparent text-sm text-muted-foreground placeholder:text-muted-foreground outline-none focus:outline-none"
              />
            </div>

            <ReplyEditor
              onWordCountChange={setWordCount}
              editorRef={editorRef}
              onSubmitReply={handleSubmitReply}
            />
          </div>
        </div>
      </section>
      <ReviewPanel scenario={scenario} />
    </div>
  );
};

export default CreateCompose;
