export function Testimonials() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <p className="text-foreground italic mb-6">
              "As a non-native speaker, this was the tool I didn't know I needed. It gave me the confidence to communicate with stakeholders at an executive level."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/20"></div>
              <div>
                <p className="text-sm font-semibold text-foreground">Alex Rivera</p>
                <p className="text-xs text-muted-foreground">Senior Product Manager</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <p className="text-foreground italic mb-6">
              "The role-play scenarios are surprisingly tough but incredibly effective. It's like having a communications coach in your pocket 24/7."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-tertiary/20"></div>
              <div>
                <p className="text-sm font-semibold text-foreground">Sarah Jenkins</p>
                <p className="text-xs text-muted-foreground">PhD Candidate, Stanford</p>
              </div>
            </div>
          </div>
          
          <div className="p-8 rounded-2xl bg-card border border-border shadow-sm flex flex-col justify-between">
            <p className="text-foreground italic mb-6">
              "Our entire customer success team uses this for onboarding. It cut down our communication training time by nearly 40%."
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-success/20"></div>
              <div>
                <p className="text-sm font-semibold text-foreground">David Chen</p>
                <p className="text-xs text-muted-foreground">VP of Success, TechCore</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
