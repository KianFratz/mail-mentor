export const SCENARIOS_DATA = [
  {
    id: 1,
    category: "Workplace",
    color: "blue",
    title: "Request a deadline extension",
    description:
      "Craft a professional request to your project manager for more time on a deliverable without sounding unprepared.",
    level: "Beginner",
    hr: {
      name: "Alex Rivera",
      profession: "Aspiring UX Researcher"
    },
  },
  {
    id: 2,
    category: "Job Applications",
    color: "purple",
    title: "Follow up after a meeting",
    description:
      "Summarize key points from a high-stakes networking call and propose clear next steps for collaboration.",
    level: "Intermediate",
    hr: {
      name: "Alex Rivera",
      profession: "Aspiring UX Researcher"
    },
  },
  {
    id: 3,
    category: "Academic",
    color: "green",
    title: "Contest a Grade",
    description:
      "Provide evidence-based reasoning to a professor to discuss a discrepancy in an exam evaluation.",
    level: "Advanced",
    hr: {
      name: "Alex Rivera",
      profession: "Aspiring UX Researcher"
    },
  },
  {
    id: 4,
    category: "Customer Service",
    color: "orange",
    title: "De-escalate an upset client",
    description:
      "Acknowledge service failures and rebuild trust through empathy and actionable recovery steps.",
    level: "Beginner",
    hr: {
      name: "Alex Rivera",
      profession: "Aspiring UX Researcher"
    },
  },
  {
    id: 5,
    category: "Workplace",
    color: "blue",
    title: "Declining a Meeting",
    description:
      "Politely decline a calendar invite while offering alternative ways to contribute or suggesting a delegate.",
    level: "Intermediate",
    hr: {
      name: "Alex Rivera",
      profession: "Aspiring UX Researcher"
    },
  },
  {
    id: 6,
    category: "Customer Service",
    color: "orange",
    title: "Handling Scope Creep",
    description:
      "Gracefully manage a client requesting extra features outside the original project agreement without sounding negative.",
    level: "Advanced",
    hr: {
      name: "Alex Rivera",
      profession: "Aspiring UX Researcher"
    },
  },
] as const;

export type Scenario = (typeof SCENARIOS_DATA)[number];

const SCENARIO_CATEGORIES = [
  ...new Set(SCENARIOS_DATA.map((s) => s.category)),
] as const;

export const CATEGORIES = ["All Scenarios", ...SCENARIO_CATEGORIES] as const;
