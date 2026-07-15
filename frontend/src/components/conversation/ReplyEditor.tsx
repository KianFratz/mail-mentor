import { useEffect, useRef, useState } from "react";
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
import axios from "axios";
import { toastManager } from "../ui/toast";
import ConfirmDialog from "../ConfirmDialog";
import { Button } from "../ui/button";
import DisplayMessage from "./DisplayMessage";
import { FeedbackPanelSkeleton } from "../feedback/FeedbackPanel";

export default function ReplyEditor({
  onWordCountChange,
  onBodyChange,
  initialTextBody,
  editorRef,
  sessionId,
  userName = "User",
  aiName = "AI",
  onEndSession,
  onStartSession,
  writingSessionStatus,
  setShowFeedback,
  disableSend,
}: ReplyEditorProps) {
  const [textSelectorOpen, setTextSelectorOpen] = useState(false);
  const [formatSelectorOpen, setFormatSelectorOpen] = useState(false);
  const [linkSelectorOpen, setLinkSelectorOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentBody, setCurrentBody] = useState(initialTextBody ?? "");
  const [isSending, setIsSending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
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
          const historyMessages: ChatMessage[] = session.messages.map(
            (m: any) => ({
              id: m.id,
              role: m.role === "ASSISTANT" ? "ai" : "user",
              content: m.content,
              timestamp: new Date(m.createdAt),
            }),
          );
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
    if (isSending) return;

    if (disableSend && !stripped) {
      toastManager.add({
        title: "Input validation",
        description: "Subject and text body should not be empty",
        type: "error",
      });
      return;
    }

    if (disableSend) {
      toastManager.add({
        title: "Input validation",
        description: "Subject should not be empty",
        type: "error",
      });
      return;
    }

    if (!stripped) {
      toastManager.add({
        title: "Input validation",
        description: "Text body should not be empty",
        type: "error",
      });
      return;
    }

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
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        if (onStartSession) {
          currentSessionId = await onStartSession();
        } else {
          throw new Error(
            "No sessionId provided — cannot call reply endpoint.",
          );
        }
      }

      const response = await api.post(
        `/writing-sessions/${currentSessionId}/reply`,
        {
          message: stripped,
        },
      );

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
      clearTimeout(timeoutId);
      setIsSending(false);
    }
  };

  const handleEndSession = async () => {
    if (!sessionId || messages.length === 0) return;
    setIsEndingSession(true);

    if (!messages) {
      toastManager.add({
        title: "Input validation",
        description: "Message is required",
        type: "error",
      });
      return;
    }

    try {
      const response = await api.post(`writing-sessions/${sessionId}/feedback`);
      onEndSession?.(response.data, messages);
    } catch (err) {
      console.error("Failed to generate feedback:", err);
      let message = "Something went wrong, please try again later.";

      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.response?.data || message;

        if (Array.isArray(message)) {
          message = message.join(", ");
        }
      } else if (err instanceof Error) {
        message = err.message;
      }

      toastManager.add({
        title: "Failed to generate feedback",
        description: message,
        type: "error",
      });
    } finally {
      setIsEndingSession(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ minHeight: "480px" }}>
      {isEndingSession ? (
        <div className="p-6 w-full">
          <FeedbackPanelSkeleton />
        </div>
      ) : (
        <>
          <DisplayMessage
            messages={messages}
            userInitials={userInitials}
            aiInitials={aiInitials}
            isSending={isSending}
            messagesEndRef={messagesEndRef}
          />

          <div className="border-t border-slate-200" />

          <div>
            <div
              ref={editorRef}
              className="rounded-b-xl transition-colors duration-500"
            >
              <EditorProvider
                key={editorKey}
                className="writing-canvas w-full min-h-[100px] text-base text-foreground focus:outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full pl-6 py-3 pr-4"
                placeholder="Write your reply…"
                content={editorKey === 0 ? initialTextBody : ""}
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

            <div className="flex items-center justify-end gap-3 px-4 py-3 border-t border-slate-100 bg-white rounded-b-xl">
              {writingSessionStatus === "graded" ? (
                <>
                  <Button type="button" onClick={() => setShowFeedback(true)}>
                    View Feedback
                  </Button>
                </>
              ) : (
                <>
                  {messages.length > 0 && (
                    <Button
                      type="button"
                      onClick={() => {
                        if (messages.length < 4) {
                          toastManager.add({
                            title: "Session validation",
                            description: "Messages should be at least 4 or greater than.",
                            type: "error",
                          });
                          return;
                        }
                        setShowEndDialog(true);
                      }}
                      disabled={isSending || isEndingSession}
                      className="
              flex items-center gap-2 px-5 py-2.5
        bg-gradient-to-r from-rose-500 to-orange-500
        text-white rounded-lg text-sm font-semibold
        hover:from-rose-600 hover:to-orange-600
        active:scale-95 transition-all shadow-md shadow-rose-200
        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isEndingSession && messages.length === 0 ? (
                        <>
                          <span className="material-symbols-outlined text-[16px] animate-spin">
                            sync
                          </span>
                          Generating Feedback...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">
                            rate_review
                          </span>
                          End Session
                        </>
                      )}
                    </Button>
                  )}
                  <Button
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
                  </Button>
                  <ConfirmDialog
                    open={showEndDialog}
                    title="End Writing Session?"
                    message="The AI will analyze your writing and provide detailed feedback after ending this session."
                    confirmText="End Session"
                    cancelText="Continue Writing"
                    loading={isEndingSession}
                    onCancel={() => setShowEndDialog(false)}
                    onConfirm={() => {
                      setShowEndDialog(false);
                      handleEndSession();
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
