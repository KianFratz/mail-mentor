import React, { useState } from "react";
import {
  EditorProvider,
  EditorBubbleMenu,
  EditorFloatingMenu,
  EditorNodeHeading1,
  EditorNodeTaskList,
  EditorNodeBulletList,
  EditorNodeOrderedList,
  EditorNodeCode,
  EditorNodeTable,
  EditorNodeText,
  EditorSelector,
  EditorFormatBold,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorFormatUnderline,
  EditorFormatCode,
  EditorFormatSubscript,
  EditorFormatSuperscript,
  EditorLinkSelector,
  EditorClearFormatting,
} from "@/components/kibo-ui/editor";

interface ReplyEditorProps {
  onWordCountChange: (count: number) => void;
  onBodyChange: (body: string) => void;
  initialTextBody?: string;
  editorRef: React.RefObject<HTMLDivElement | null>;
}

export default function ReplyEditor({
  onWordCountChange,
  onBodyChange,
  initialTextBody,
  editorRef,
}: ReplyEditorProps) {
  const [textSelectorOpen, setTextSelectorOpen] = useState(false);
  const [formatSelectorOpen, setFormatSelectorOpen] = useState(false);
  const [linkSelectorOpen, setLinkSelectorOpen] = useState(false);

  return (
      <div className="flex flex-col gap-3">
        <div
          ref={editorRef}
          className="rounded-xl transition-colors duration-500"
        >
          <EditorProvider
            className="writing-canvas w-full min-h-[120px] text-base text-foreground focus:outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full pl-6 py-2"
            placeholder="Write your reply here..."
            content={initialTextBody}
            onUpdate={({ editor }) => {
              onWordCountChange(editor.storage.characterCount.words());
              onBodyChange(editor.getHTML());
            }}
          >
            <EditorFloatingMenu className="flex items-center gap-0.5 rounded-xl border bg-background p-0.5 shadow">
              <EditorNodeHeading1 hideName />
              <EditorNodeTaskList hideName />
              <EditorNodeBulletList hideName />
              <EditorNodeOrderedList hideName />
              <EditorNodeCode hideName />
              <EditorNodeTable hideName />
            </EditorFloatingMenu>

            <EditorBubbleMenu>
              <EditorSelector
                open={textSelectorOpen}
                onOpenChange={(open) => {
                  setTextSelectorOpen(open);
                  if (open) setFormatSelectorOpen(false);
                }}
                title="Text"
              >
                <EditorNodeText />
                <EditorNodeHeading1 />
                <EditorNodeBulletList />
                <EditorNodeOrderedList />
                <EditorNodeTaskList />
                <EditorNodeCode />
                <EditorNodeTable />
              </EditorSelector>

              <EditorSelector
                open={formatSelectorOpen}
                onOpenChange={(open) => {
                  setFormatSelectorOpen(open);
                  if (open) setTextSelectorOpen(false);
                }}
                title="Format"
              >
                <EditorFormatBold />
                <EditorFormatItalic />
                <EditorFormatUnderline />
                <EditorFormatStrike />
                <EditorFormatCode />
                <EditorFormatSubscript />
                <EditorFormatSuperscript />
              </EditorSelector>

              <EditorLinkSelector
                open={linkSelectorOpen}
                onOpenChange={(open) => {
                  setLinkSelectorOpen(open);
                  if (open) {
                    setTextSelectorOpen(false);
                    setFormatSelectorOpen(false);
                  }
                }}
              />

              <EditorClearFormatting hideName />
            </EditorBubbleMenu>
          </EditorProvider>
        </div>

        <div className="flex justify-end p-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all shadow-sm"
          >
            Reply
            <span className="material-symbols-outlined text-[18px]">send</span>
          </button>
        </div>
      </div>
  );
}
