import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
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
import { getInitials, cn } from "@/lib/utils";
import axios from "axios";
import { toastManager } from "../ui/toast";
import ConfirmDialog from "../ConfirmDialog";
import { Button } from "../ui/button";
import DisplayMessage from "./DisplayMessage";
import { FeedbackPanelSkeleton } from "../feedback/FeedbackPanel";
import { useConversationStore } from "@/store/conversation.store";
import { countWords } from "@/lib/reply-editor";

export default function ReplyEditor({ editorRef }: ReplyEditorProps) {
  const navigate = useNavigate();
  const [textSelectorOpen, setTextSelectorOpen] = useState(false);
  const [formatSelectorOpen, setFormatSelectorOpen] = useState(false);
  const [linkSelectorOpen, setLinkSelectorOpen] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [isEndingSession, setIsEndingSession] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const {
    scenario,
    sessionId,
    messages,
    isStreaming,
    status: writingSessionStatus,
    subject,
    addMessage,
    setStreaming,
    setFeedback,
    setShowFeedback,
    setWordCount,
    setTextBody,
    textBody,
    setSession,
    clearTextBody,
  } = useConversationStore();

  const [currentBody, setCurrentBody] = useState(textBody ?? "");
  const [charCount, setCharCount] = useState(() =>
    textBody ? textBody.replace(/<[^>]*>/g, "").length : 0
  );
  const [isAtBottom, setIsAtBottom] = useState(true);

  useEffect(() => {
    const container = editorRef?.current?.querySelector(".writing-canvas") as HTMLElement | null;
    if (!container) return;

    const checkScroll = () => {
      const atBottom =
        container.scrollTop + container.clientHeight >= container.scrollHeight - 15;
      setIsAtBottom(atBottom);
    };

    checkScroll();

    container.addEventListener("scroll", checkScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", checkScroll);
    };
  }, [editorKey, charCount, editorRef]);

  const handleScrollDown = () => {
    const container = editorRef?.current?.querySelector(".writing-canvas") as HTMLElement | null;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  let userName = "User";
  try {
    const tokenStr = localStorage.getItem("access_token");
    if (tokenStr) {
      const payload = JSON.parse(atob(tokenStr.split(".")[1]));
      userName =
        payload.name ||
        `${payload.firstName || ""} ${payload.lastName || ""}`.trim() ||
        "User";
    }
  } catch (e) {}

  const userInitials = getInitials(userName, "U");
  const aiName = scenario?.aiPersona?.name || "AI";
  const aiInitials = getInitials(aiName);
  const disableSend = !subject?.trim();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = async () => {
    const stripped = currentBody.replace(/<[^>]*>/g, "").trim();
    if (isStreaming) return;

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

    if (stripped.length > 1000 || charCount > 1000) {
      toastManager.add({
        title: "Input validation",
        description: "Text body should not exceed 1000 characters",
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

    const messageWordCount = countWords(currentBody);

    addMessage(userMsg);
    setStreaming(true);
    setEditorKey((k) => k + 1);
    setCurrentBody("");
    setTextBody("");
    clearTextBody();
    setWordCount(0);
    setCharCount(0);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let shouldNavigate = false;

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const createRes = await api.post("/writing-session/create", {
          subjectLine: subject,
          textBody: currentBody,
          wordCount: 0,
          scenarioId: scenario?.id,
        });
        currentSessionId = createRes.data.id;
        setSession(currentSessionId);
        shouldNavigate = true;
      }

      const response = await api.post(
        `/writing-sessions/${currentSessionId}/reply`,
        {
          message: currentBody,
          wordCount: messageWordCount,
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

      addMessage(aiMsg);
      setStreaming(false);

      if (shouldNavigate) {
        navigate(`/conversation/${currentSessionId}`, { replace: true });
      }
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
      addMessage(errMsg);
      setStreaming(false);
    } finally {
      clearTimeout(timeoutId);
      if (useConversationStore.getState().isStreaming) {
        setStreaming(false);
      }
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

    const timer = setTimeout(() => {
      toastManager.add({
        title: "Still generating...",
        description:
          "Your feedback is taking longer than usual. Please wait a little longer.",
        type: "info",
      });
      return;
    }, 30000);

    try {
      const localDate = new Date().toLocaleDateString("en-CA");
      const response = await api.post(
        `writing-sessions/${sessionId}/feedback`,
        {},
        {
          timeout: 60000,
          params: { localDate },
        },
      );

      clearTimeout(timer);

      if (response) setFeedback(response.data);
      setShowFeedback(true);
    } catch (err) {
      let message = "Something went wrong, please try again later.";

      if (axios.isAxiosError(err)) {
        if (err.code === "ECONNABORTED") {
          message =
            "Generating feedback is taking longer than expected. Please try again.";
        } else {
          err.response?.data?.message || err.response?.data || message;
        }

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
            isSending={isStreaming}
            messagesEndRef={messagesEndRef}
          />

          <div className="border-t border-slate-200" />

          <div>
            <div
              ref={editorRef}
              className="rounded-b-xl transition-colors duration-500 relative"
            >
              <EditorProvider
                key={editorKey}
                limit={1000}
                className="writing-canvas w-full min-h-[100px] max-h-[260px] overflow-y-auto text-base text-foreground focus:outline-none [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-muted [&::-webkit-scrollbar-thumb]:rounded-full pl-6 py-3 pr-4"
                placeholder={
                  writingSessionStatus === "graded" ? "" : "Write your reply..."
                }
                content={editorKey === 0 ? textBody : ""}
                editable={!(writingSessionStatus === "graded")}
                editorProps={{
                  handleKeyDown(view, event) {
                    if (event.key === "Enter") {
                      const { from, to } = view.state.selection;
                      const currentLen = view.state.doc.textContent.length;
                      const selectedLen = to - from;
                      if (currentLen - selectedLen + 1 > 1000) {
                        toastManager.add({
                          title: "Character limit reached",
                          description:
                            "You cannot write more than 1000 characters.",
                          type: "error",
                        });
                        return true;
                      }
                    }
                    return false;
                  },
                  handleTextInput(view, from, to, text) {
                    const currentLen = view.state.doc.textContent.length;
                    const selectedLen = to - from;
                    if (currentLen - selectedLen + text.length > 1000) {
                      toastManager.add({
                        title: "Character limit reached",
                        description:
                          "You cannot write more than 1000 characters.",
                        type: "error",
                      });
                      return true;
                    }
                    return false;
                  },
                  handlePaste(view, event) {
                    const text = event.clipboardData?.getData("text/plain");

                    if (text) {
                      const { from, to } = view.state.selection;
                      const currentLen = view.state.doc.textContent.length;
                      const selectedLen = to - from;
                      if (currentLen - selectedLen + text.length > 1000) {
                        toastManager.add({
                          title: "Character limit reached",
                          description:
                            "Pasted text exceeds the 1000 character limit.",
                          type: "error",
                        });
                        const allowedCount = Math.max(
                          0,
                          1000 - (currentLen - selectedLen)
                        );
                        if (allowedCount > 0) {
                          const truncated = text.slice(0, allowedCount);
                          const { schema } = view.state;
                          const node = schema.text(truncated);
                          const tr = view.state.tr.replaceSelectionWith(
                            node,
                            false
                          );
                          view.dispatch(tr);
                        }
                        return true;
                      }

                      const { schema } = view.state;
                      const node = schema.text(text);
                      const tr = view.state.tr.replaceSelectionWith(
                        node,
                        false
                      );
                      view.dispatch(tr);
                      return true;
                    }

                    return false;
                  },
                }}
                onUpdate={({ editor }) => {
                  const text = editor.getText();
                  const len = text.length;
                  if (len >= 1000 && charCount < 1000) {
                    toastManager.add({
                      title: "Character limit reached",
                      description:
                        "Maximum limit of 1000 characters has been reached.",
                      type: "error",
                    });
                  }
                  setCharCount(len);
                  setWordCount(countWords(text));
                  const html = editor.getHTML();
                  setTextBody(html);
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

              {charCount >= 500 && !isAtBottom && (
                <button
                  type="button"
                  onClick={handleScrollDown}
                  className="absolute bottom-3 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 hover:bg-white text-violet-700 hover:text-violet-900 border border-violet-200/90 shadow-md hover:shadow-lg rounded-full text-xs font-semibold backdrop-blur-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer group"
                  title="Scroll to bottom"
                >
                  <span className="material-symbols-outlined text-[16px] text-violet-600 group-hover:translate-y-0.5 transition-transform">
                    arrow_downward
                  </span>
                  <span>Scroll down</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-slate-100 bg-white rounded-b-xl">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-medium tabular-nums transition-colors",
                    charCount >= 1000
                      ? "text-rose-600 font-semibold"
                      : "text-slate-400"
                  )}
                >
                  {charCount}/1000 characters
                </span>
                {charCount >= 1000 && (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium px-2.5 py-0.5 bg-rose-50 border border-rose-200 rounded-full animate-in fade-in duration-200">
                    <span className="material-symbols-outlined text-[14px] text-rose-600">
                      error
                    </span>
                    Character limit reached
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {writingSessionStatus === "graded" ? (
                  <Button
                    type="button"
                    onClick={() => setShowFeedback(true)}
                    className="text-sm"
                  >
                    View Feedback
                  </Button>
                ) : (
                  <>
                    {messages.length > 0 && (
                      <Button
                        type="button"
                        onClick={() => {
                          if (messages.length < 4) {
                            toastManager.add({
                              title: "Session validation",
                              description:
                                "Messages should be at least 4 or greater than.",
                              type: "error",
                            });
                            return;
                          }
                          setShowEndDialog(true);
                        }}
                        disabled={isStreaming || isEndingSession}
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
                  </>
                )}
                {writingSessionStatus !== "graded" && (
                  <Button
                    type="button"
                    onClick={handleSend}
                    disabled={isStreaming}
                    className="
                flex items-center gap-2 px-5 py-2.5
                bg-gradient-to-r from-violet-600 to-indigo-600
                text-white rounded-lg text-sm font-semibold
                hover:from-violet-700 hover:to-indigo-700
                active:scale-95 transition-all shadow-md shadow-violet-200
                disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
              "
                  >
                    {isStreaming ? (
                      <>
                        <span className="material-symbols-outlined text-[16px] animate-spin">
                          sync
                        </span>
                        Sending…
                      </>
                    ) : (
                      <>
                        <>
                          Send Reply
                          <span className="material-symbols-outlined text-[16px]">
                            send
                          </span>
                        </>
                      </>
                    )}
                  </Button>
                )}
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
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
