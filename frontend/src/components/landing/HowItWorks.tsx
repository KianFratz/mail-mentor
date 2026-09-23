export function HowItWorks() {
  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col gap-12 md:flex-row">
          <div className="md:w-1/3">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Practise the writing, don’t outsource it
            </h2>
            <p className="text-muted-foreground">
              Most tools write the email for you. Mail Mentor helps you become
              better at writing it through realistic practice and useful
              coaching. AI brings each situation to life and responds to what
              you write, but you build the skill.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:w-2/3 md:grid-cols-2">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                01
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Choose a situation
              </h4>
              <p className="text-muted-foreground text-sm">
                Start with a realistic workplace situation you want to feel
                more prepared for.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                02
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Write your reply
              </h4>
              <p className="text-muted-foreground text-sm">
                Compose the message yourself and put your judgment into
                practice.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                03
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Receive a realistic response
              </h4>
              <p className="text-muted-foreground text-sm">
                Continue the conversation with a responsive persona that
                reacts to what you actually said.
              </p>
            </div>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-muted-foreground/50">
                04
              </div>
              <h4 className="text-2xl font-semibold text-primary">
                Review actionable coaching
              </h4>
              <p className="text-muted-foreground text-sm">
                AI reviews the exchange to show what worked, what to improve,
                and how to make your next reply clearer and more effective.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
