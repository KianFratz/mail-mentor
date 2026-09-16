export function AnalyticsPreview() {
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto max-w-5xl">
        <div className="glass-card rounded-2xl p-10 border border-primary/10 shadow-xl overflow-hidden relative">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2 space-y-6">
              <div className="inline-block px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-bold uppercase tracking-widest">
                Analytics
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-primary">
                Track Your Skill Proficiency
              </h2>
              <p className="text-muted-foreground">
                The dashboard aggregates feedback across Grammar, Clarity,
                Etiquette, Structure, Professional Tone, and Conciseness.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-success"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="text-sm font-semibold">
                    Recent score history
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-success"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="text-sm font-semibold">
                    Practice streaks and badges
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-success"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    check_circle
                  </span>
                  <span className="text-sm font-semibold">
                    Feedback strengths and improvements
                  </span>
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 w-full space-y-4">
              {/* Mock Metric Bars */}
              <div className="space-y-6 bg-muted p-6 rounded-xl border border-border">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      Grammar
                    </span>
                    <span className="text-sm font-semibold text-success">
                      94%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[94%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      Professional Tone
                    </span>
                    <span className="text-sm font-semibold text-success">
                      82%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-success w-[82%]"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold text-primary">
                      Clarity
                    </span>
                    <span className="text-sm font-semibold text-tertiary">
                      68%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-tertiary w-[68%]"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
