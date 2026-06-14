import { Link } from "react-router";

export function HeroSection() {
  return (
    <section className="relative min-h-[921px] flex items-center overflow-hidden px-4 md:px-8 py-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tertiary/20 text-tertiary font-medium text-sm">
            <span className="material-symbols-outlined text-[18px]">
              auto_awesome
            </span>
            AI-Powered Skill Mastering
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-primary tracking-tight leading-tight">
            Master the Art of{" "}
            <span className="text-tertiary">Professional Communication</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl">
            Bridge the gap between technical expertise and professional
            influence. Practice with hyper-realistic AI scenarios and get
            real-time coaching on tone, empathy, and clarity.
          </p>
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-semibold hover:opacity-90 transition-all active:scale-95 shadow-lg">
              <Link to="/login">Start Writing for Free</Link>
            </button>
            <button className="px-8 py-4 border border-border text-primary rounded-2xl font-semibold hover:bg-muted transition-all">
              <Link to="/login">View Scenarios</Link>
            </button>
          </div>
        </div>

        {/* Hero Workspace Visual */}
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/10 to-tertiary/10 blur-3xl rounded-full"></div>
          <div className="relative glass-card rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="bg-muted h-8 w-full flex items-center px-4 gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-destructive"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-success"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-primary/40"></div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <div className="text-sm font-medium text-muted-foreground">
                  To: manager@company.com
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-success/20 text-success rounded text-xs font-bold">
                    PROFESSIONAL
                  </span>
                </div>
              </div>
              <div className="space-y-2 min-h-[160px]">
                <p className="text-muted-foreground italic">
                  Subject: Project Status Update
                </p>
                <p className="text-foreground">
                  Hi Team, I wanted to reach out regarding the delays...
                </p>
                <div className="p-3 bg-tertiary/10 border-l-4 border-tertiary rounded-r-lg mt-4 ai-glow">
                  <div className="flex gap-2 items-center text-tertiary mb-1">
                    <span className="material-symbols-outlined text-[16px]">
                      psychology
                    </span>
                    <span className="text-xs font-bold">AI INSIGHT</span>
                  </div>
                  <p className="text-sm">
                    Your tone is slightly passive. Try: "I am addressing the
                    current delays by..." to show more leadership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"></div>
    </section>
  );
}
