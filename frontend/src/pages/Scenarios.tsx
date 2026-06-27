import { useEffect, useState } from "react";
import { AIPopover } from "@/components/scenarios/AiPopover";
import { CategoryFilter } from "@/components/scenarios/CategoryFilter";
import { FeaturedScenario } from "@/components/scenarios/FeaturedScenario";
import { ScenarioCard } from "@/components/scenarios/ScenarioCard";
import CreateCompose from "@/components/conversation/CreateCompose";
import api from "@/lib/axios";
import type { Scenario } from "@/types/scenario.type";

function Scenarios() {
  const [activeCategory, setActiveCategory] = useState<
    Scenario["category"] | "All Scenarios"
  >("All Scenarios");
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(
    null,
  );
  const [scenarios, setScenarios] = useState([]);
  const categoriesList = [
    "All Scenarios",
    ...new Set(scenarios.map((s) => s.category)),
  ];

  useEffect(() => {
    getScenarios().then(setScenarios);
  }, []);

  const getScenarios = async () => {
    try {
      const { data } = await api.get("/scenarios");

      return data;
    } catch (error) {
      console.error("Failed fetching data Scenarios");
    }
  };

  const visibleScenarios = scenarios.filter(
    (s) => activeCategory === "All Scenarios" || s.category === activeCategory,
  );

  return (
    <main className="flex-grow overflow-y-auto p-margin-mobile md:p-margin-desktop bg-[#F9FAFB]">
      <div className="max-w-5xl mx-auto py-8 px-2">
        {!selectedScenario ? (
          <>
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
              {categoriesList.map((cat) => (
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
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              }}
            >
              {visibleScenarios.map((scenario) => (
                <ScenarioCard
                  key={scenario.id}
                  scenario={scenario}
                  onSelect={setSelectedScenario}
                />
              ))}
              {activeCategory === "All Scenarios" && <FeaturedScenario />}
            </div>
          </>
        ) : (
          <CreateCompose scenario={selectedScenario} />
        )}
      </div>
      <AIPopover />
    </main>
  );
}

export default Scenarios;
