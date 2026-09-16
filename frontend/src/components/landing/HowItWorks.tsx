export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Build a conversation, review the result, and track your progress
              over time.
            </p>
          </div>
          <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                01
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Pick a Scenario
              </h4>
              <p className="text-muted-foreground text-sm">
                Select from our library of real-world challenges tailored to
                your goals.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                02
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Draft & Refine
              </h4>
              <p className="text-muted-foreground text-sm">
                Compose a response and exchange replies with the scenario's AI
                persona.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                03
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Master with Feedback
              </h4>
              <p className="text-muted-foreground text-sm">
                End the session to review feedback, proficiency scores, and
                suggested improvements.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
