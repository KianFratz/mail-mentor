import React, { useState, useRef } from "react";
import ReplyEditor from "./ReplyEditor";

export default function CompositionArea() {
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

  const handleSubmitReply = () => {
    console.log("Reply submitted:");
  }


  return (
    <section className="flex-1 bg-background overflow-y-auto relative px-4 md:px-8 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">
              Internship Inquiry
            </h1>
            <p className="text-base text-muted-foreground mt-1">
              Subject: Internship Application - Product Design
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

        <div
          className="bg-card rounded-2xl shadow-sm border border-border flex flex-col"
          style={{ minHeight: "600px" }}
        >
          <div className="p-4 border-b border-border bg-muted/30 flex items-center justify-between rounded-t-2xl">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary">
                forum
              </span>
              <h2 className="text-lg font-semibold text-foreground">
                Conversation with HR Manager
              </h2>
            </div>
            <span className="px-3 py-1 bg-tertiary/10 text-tertiary rounded-full text-xs font-medium">
              Active Session
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-background/50">
            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="p-4 flex justify-between items-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-foreground text-[18px]">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      HR Manager{" "}
                      <span className="font-normal text-muted-foreground">
                        &lt;hr@techfirm.com&gt;
                      </span>
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      To: Alex Rivera
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">10:15 AM</span>
              </div>
              <div className="p-6 bg-card">
                <p className="text-base text-foreground">
                  Hello Alex, thank you for reaching out. I've reviewed your
                  initial inquiry. Could you tell me more about your experience
                  with user testing?
                </p>
              </div>
            </div>

            <div className="border border-border rounded-xl overflow-hidden bg-card">
              <div className="p-4 flex justify-between items-center bg-muted/50 cursor-pointer hover:bg-muted transition-colors">
                <div className="flex items-center gap-3">
                  <img
                    alt="Alex Rivera"
                    className="w-8 h-8 rounded-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuATzUKM1t1LOJrjWmtC32_8orAq1lcVQVgwhHxBO7csVT-AgwJ8CTBOYqfRfLa8m8ou13xyFU71EWe3jEvquqwhMQh6FgkgB0Rn_OJVse5FMLnscGzIDPIEhO1-EDA2FAHqqaRag6ateTvr4XN5XBU-QTz7JcbgOXVeUfnhdpf-gdn9zrVVbJ0CY41mxXY8hmQmxkPnSAIS9yCdpqqPY65Oo79Re1GxilCWeUEje8NeIC_Rn_mUTYrCJKiwfO6MyyJ2EXnrZXT7_YAK"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Alex Rivera{" "}
                      <span className="font-normal text-muted-foreground">
                        &lt;alex.rivera@email.com&gt;
                      </span>
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      To: HR Manager
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">10:17 AM</span>
              </div>
              <div className="p-6 bg-card">
                <p className="text-base text-foreground">
                  Certainly! During my last project, I conducted moderated
                  usability testing with 10 participants to validate our
                  navigation flow.
                </p>
              </div>
            </div>

            <div className="border border-primary/20 rounded-xl overflow-hidden shadow-sm bg-card">
              <div className="p-4 flex justify-between items-center bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary-foreground text-[18px]">
                      person
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      HR Manager{" "}
                      <span className="font-normal text-muted-foreground">
                        &lt;hr@techfirm.com&gt;
                      </span>
                    </p>
                    <p className="text-[12px] text-muted-foreground">
                      To: Alex Rivera
                    </p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">10:20 AM</span>
              </div>
              <div className="p-6 bg-card">
                <p className="text-base text-foreground">
                  That sounds relevant. How did you synthesize those findings
                  for the design team?
                </p>
              </div>
            </div>
          </div>

          <ReplyEditor onWordCountChange={setWordCount} editorRef={editorRef} onSubmitReply={handleSubmitReply}/>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-xl text-sm font-medium hover:bg-muted transition-all">
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
              End Conversation
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl text-sm font-medium shadow-sm hover:opacity-90 active:scale-95 transition-all">
              Send Email
              <span className="material-symbols-outlined text-[20px]">
                send
              </span>
            </button>
            <button className="px-6 py-3 bg-muted text-foreground rounded-xl text-sm font-medium hover:bg-muted/80 transition-all">
              Save Draft
            </button>
          </div>
          <div className="flex items-center gap-4 ">
            <div className="relative group">
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background px-3 py-1 rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                4 potential improvements
              </div>
              <button
                className={`p-3 pb-2 bg-tertiary/10 text-tertiary rounded-full hover:bg-tertiary/20 transition-all ${isPolishing ? "opacity-80" : ""}`}
                onClick={handleMagicClick}
              >
                {isPolishing ? (
                  <span className="material-symbols-outlined text-[18px] animate-spin">
                    sync
                  </span>
                ) : (
                  <span
                    className="material-symbols-outlined"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-8 top-32 w-64 hidden xl:block">
        <div className="bg-violet-200 rounded-2xl p-4 shadow-xl border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-tertiary text-tertiary-foreground rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-[16px]">
                psychology
              </span>
            </div>
            <span className="text-sm font-medium text-tertiary">
              Live Insight
            </span>
          </div>
          <p className="text-sm text-violet-800 mb-3">
            Your tone is currently{" "}
            <span className="font-bold text-violet-900">Neutral</span>. Consider
            adding more enthusiasm to show cultural fit.
          </p>
          <button className="w-full py-2 bg-white text-xs font-medium rounded-lg hover:bg-tertiary/100 hover:text-white transition-colors">
            Apply Tone Shift
          </button>
        </div>
      </div>
    </section>
  );
}
