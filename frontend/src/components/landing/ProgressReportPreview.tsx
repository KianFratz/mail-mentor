const sampleCategories = [
  { name: "Clarity", score: 88, color: "bg-success" },
  { name: "Professional Tone", score: 84, color: "bg-success" },
  { name: "Structure", score: 78, color: "bg-tertiary" },
  { name: "Grammar", score: 92, color: "bg-success" },
  { name: "Etiquette", score: 86, color: "bg-success" },
  { name: "Conciseness", score: 74, color: "bg-tertiary" },
] as const;

export function ProgressReportPreview() {
  return (
    <section className="px-4 py-24 md:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="glass-card rounded-2xl border border-primary/10 p-6 shadow-xl md:p-10">
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:items-center md:gap-14">
            <div className="space-y-6">
              <div className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                Sample product output
              </div>
              <h2 className="text-3xl font-bold text-primary md:text-4xl">
                See what practice teaches you
              </h2>
              <p className="text-muted-foreground">
                After a practice session, Mail Mentor turns your draft into
                specific coaching you can use in your next reply—not just a
                score.
              </p>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <span className="font-semibold text-primary">Strength:</span>{" "}
                  Your request gives a clear reason and a specific new deadline.
                </p>
                <p>
                  <span className="font-semibold text-primary">
                    Improvement opportunity:
                  </span>{" "}
                  Add a concise call to action so the reader knows how to
                  respond.
                </p>
              </div>
            </div>

            <div className="w-full rounded-xl border border-border bg-muted p-4 sm:p-6">
              <div className="mb-5 border-b border-border pb-5">
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Illustrative practice report
                </p>
                <p className="mt-2 text-sm font-semibold text-primary">
                  Sample data · not a customer result
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  Scenario: Request a Deadline Extension
                </p>
              </div>

              <div className="space-y-4" aria-label="Sample feedback categories">
                {sampleCategories.map((category) => (
                  <div key={category.name}>
                    <div className="mb-1.5 flex items-center justify-between gap-4">
                      <span className="text-sm font-semibold text-primary">
                        {category.name}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                        Sample score {category.score}/100
                      </span>
                    </div>
                    <div
                      className="h-2 w-full overflow-hidden rounded-full bg-border"
                      aria-hidden="true"
                    >
                      <div
                        className={`h-full ${category.color}`}
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
                <div className="rounded-lg border border-success/20 bg-success/10 p-3">
                  <p className="font-semibold text-primary">What worked</p>
                  <p className="mt-1 text-muted-foreground">
                    Clear purpose and professional tone.
                  </p>
                </div>
                <div className="rounded-lg border border-tertiary/20 bg-tertiary/10 p-3">
                  <p className="font-semibold text-primary">Try next</p>
                  <p className="mt-1 text-muted-foreground">
                    Finish with a direct call to action.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
