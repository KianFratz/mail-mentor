import React, { useEffect, useRef, useState } from "react";
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
import api from "@/lib/axios";
import type { ChatMessage, ReplyEditorProps } from "@/types/reply-editor.type";
import { getInitials } from "@/lib/utils";
import { MessageBubble } from "../MessageBubble";
import { TypingIndicator } from "../TypingIndicator";
import axios from "axios";

export default function ReplyEditor({
  onWordCountChange,
  onBodyChange,
  initialTextBody,
  editorRef,
  sessionId,
  userName = "User",
  aiName = "AI",
}: ReplyEditorProps) {
  const [textSelectorOpen, setTextSelectorOpen] = useState(false);
  const [formatSelectorOpen, setFormatSelectorOpen] = useState(false);
  const [linkSelectorOpen, setLinkSelectorOpen] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentBody, setCurrentBody] = useState(initialTextBody ?? "");
  const [isSending, setIsSending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userInitials = getInitials(userName, "U");
  const aiInitials = getInitials(aiName, "AI");

  useEffect(() => {
    const fetchHistory = async () => {
      if (!sessionId) return;
      try {
        const response = await api.get(`/writing-session/${sessionId}`);
        const session = response.data;
        if (session.messages && session.messages.length > 0) {
          const historyMessages: ChatMessage[] = session.messages.map((m: any) => ({
            id: m.id,
            role: m.role === "ASSISTANT" ? "ai" : "user",
            content: m.content,
            timestamp: new Date(m.createdAt),
          }));
          setMessages(historyMessages);
        }
      } catch (err) {
        console.error("Failed to fetch session history:", err);
      }
    };
    fetchHistory();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const handleSend = async () => {
    const stripped = currentBody.replace(/<[^>]*>/g, "").trim();
    if (!stripped || isSending) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: currentBody,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSending(true);

    setEditorKey((k) => k + 1);
    setCurrentBody("");
    onBodyChange("");
    onWordCountChange(0);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (!sessionId) {
        throw new Error("No sessionId provided — cannot call reply endpoint.");
      }

      const response = await api.post(`/writing-sessions/${sessionId}/reply`, {
        message: stripped,
      });

      const aiReply: string =
        response.data?.reply ?? "I'm not sure how to respond to that.";

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        content: aiReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const isTimeout =
        axios.isCancel(err) ||
        (axios.isAxiosError(err) && err.code == "ERR_CANCELED");

      console.error("Reply endpoint error:", err);
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "ai",
        content: isTimeout
          ? "The AI is taking too long to respond. Please try again."
          : "Sorry, something went wrong while fetching a response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      clearTimeout(timeoutId)
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "480px" }}>
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 bg-slate-50/60 min-h-[220px]">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full py-10 text-center gap-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-violet-500 text-[22px]">
                forum
              </span>
            </div>
            <p className="text-sm font-medium text-slate-600">
              Start the conversation
            </p>
            <p className="text-xs text-slate-400 max-w-xs">
              Write your reply below and hit{" "}
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono shadow-sm">
                Send Reply
              </kbd>{" "}
              to get an AI response.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            userInitials={userInitials}
            aiInitials={aiInitials}
          />
        ))}

        {isSending && <TypingIndicator aiInitials={aiInitials} />}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-slate-200" />

      <div>
        <div
          ref={editorRef}
          className="rounded-b-xl transition-colors duration-500"
        >
          <EditorProvider
            key={editorKey}
            className="writing-canvas w-full min-h-[100px] text-base text-foreground focus:outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full pl-6 py-3 pr-4"
            placeholder="Write your reply… (Ctrl+Enter to send)"
            content={initialTextBody}
            onUpdate={({ editor }) => {
              onWordCountChange(editor.storage.characterCount.words());
              const html = editor.getHTML();
              onBodyChange(html);
              setCurrentBody(html);
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

        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 bg-white rounded-b-xl">
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            className="
              flex items-center gap-2 px-5 py-2.5
              bg-gradient-to-r from-violet-600 to-indigo-600
              text-white rounded-lg text-sm font-semibold
              hover:from-violet-700 hover:to-indigo-700
              active:scale-95 transition-all shadow-md shadow-violet-200
              disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
            "
          >
            {isSending ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">
                  sync
                </span>
                Sending…
              </>
            ) : (
              <>
                Send Reply
                <span className="material-symbols-outlined text-[16px]">
                  send
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
