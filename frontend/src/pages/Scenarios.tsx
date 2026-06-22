import { useState } from "react";
import { AIPopover } from "@/components/scenarios/AiPopover";
import { CategoryFilter } from "@/components/scenarios/CategoryFilter";
import { FeaturedScenario } from "@/components/scenarios/FeaturedScenario";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";

const CATEGORIES = [
  "All Scenarios",
  "Workplace",
  "Academic",
  "Customer Service",
  "Job Applications",
];

function Scenarios() {
  const [activeCategory, setActiveCategory] = useState("All Scenarios");

  return (
    <main className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        <section className="mb-6">
          <h1 className="text-2xl font-bold text-primary mb-2 leading-tight">
            Scenario Library
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Master professional communication by practicing with real-world
            scenarios designed to sharpen your cognitive drafting skills.
          </p>
        </section>

        <div className="flex flex-wrap gap-3 mb-8">
          {CATEGORIES.map((cat) => (
            <CategoryFilter
              key={cat}
              label={cat}
              isActive={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </div>

        <div
          className="grid gap-6"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}
        >
          {(activeCategory === "All Scenarios" || activeCategory === "Workplace") && (
            <ScenarioCard
              category="Workplace"
              categoryColor="blue"
              title="Request a deadline extension"
              description="Craft a professional request to your project manager for more time on a deliverable without sounding unprepared."
              level="Beginner"
            />
          )}
          {(activeCategory === "All Scenarios" || activeCategory === "Job Applications") && (
            <ScenarioCard
              category="Job Applications"
              categoryColor="purple"
              title="Follow up after a meeting"
              description="Summarize key points from a high-stakes networking call and propose clear next steps for collaboration."
              level="Intermediate"
            />
          )}
          {(activeCategory === "All Scenarios" || activeCategory === "Academic") && (
            <ScenarioCard
              category="Academic"
              categoryColor="green"
              title="Contest a Grade"
              description="Provide evidence-based reasoning to a professor to discuss a discrepancy in an exam evaluation."
              level="Advanced"
            />
          )}
          {(activeCategory === "All Scenarios" || activeCategory === "Customer Service") && (
            <ScenarioCard
              category="Customer Service"
              categoryColor="orange"
              title="De-escalate an upset client"
              description="Acknowledge service failures and rebuild trust through empathy and actionable recovery steps."
              level="Beginner"
            />
          )}
          {(activeCategory === "All Scenarios") && <FeaturedScenario />}
          {(activeCategory === "All Scenarios" || activeCategory === "Workplace") && (
            <ScenarioCard
              category="Workplace"
              categoryColor="blue"
              title="Declining a Meeting"
              description="Politely decline a calendar invite while offering alternative ways to contribute or suggesting a delegate."
              level="Intermediate"
            />
          )}
        </div>
      </div>
      <AIPopover />
    </main>
  );
}

export default Scenarios;
