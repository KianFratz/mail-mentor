export function FeaturesSection() {
  return (
    <section className="py-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-primary">Precision-Engineered Learning</h2>
          <p className="text-base text-muted-foreground max-w-2xl mx-auto">
            Advanced simulation tools designed to transform how you think about everyday correspondence.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto">
          {/* Feature 1 */}
          <div className="md:col-span-7 bg-background p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-6">
                  <span className="material-symbols-outlined text-primary">school</span>
                </div>
                <h3 className="text-2xl font-semibold text-primary mb-3">Realistic Scenarios</h3>
                <p className="text-muted-foreground">
                  Choose from 500+ curated prompts across Workplace, Academic, and Customer Service contexts. Every scenario is modeled on real-world professional challenges.
                </p>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-xl">
                  <span className="text-sm font-semibold text-primary">Crisis Management</span>
                </div>
                <div className="bg-muted p-4 rounded-xl">
                  <span className="text-sm font-semibold text-primary">Salary Negotiation</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Feature 2 */}
          <div className="md:col-span-5 bg-tertiary text-tertiary-foreground p-8 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-white">psychology</span>
              </div>
              <h3 className="text-2xl font-semibold mb-3">AI-Powered Coaching</h3>
              <p className="text-white/80">
                Get immediate breakdown on Tone, Clarity, and Impact. Our AI doesn't just correct grammar; it coaches your strategy.
              </p>
            </div>
            <div className="absolute bottom-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Feature 3 */}
          <div className="md:col-span-12 bg-success/10 p-8 rounded-2xl border border-success/20 flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-2xl font-semibold text-success">Interactive Simulation</h3>
              <p className="text-muted-foreground">
                Beyond simple emails, engage in back-and-forth role-play. The AI persona reacts to your responses, creating a dynamic learning loop that mirrors high-stakes conversations.
              </p>
              <button className="text-success text-sm font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                Try a demo scenario <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
            <div className="md:w-1/2 w-full h-48 bg-background rounded-xl shadow-inner border border-border p-4 overflow-hidden">
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <div className="w-6 h-6 rounded bg-muted-foreground/20 flex-shrink-0"></div>
                  <div className="h-4 bg-muted w-3/4 rounded"></div>
                </div>
                <div className="flex gap-2 items-start justify-end">
                  <div className="h-4 bg-success/20 w-2/3 rounded"></div>
                  <div className="w-6 h-6 rounded bg-success flex-shrink-0"></div>
                </div>
                <div className="flex gap-2 items-start">
                  <div className="w-6 h-6 rounded bg-muted-foreground/20 flex-shrink-0"></div>
                  <div className="h-4 bg-muted w-1/2 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
