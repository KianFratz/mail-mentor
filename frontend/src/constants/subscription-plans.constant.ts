export const subscriptionPlanDetails = {
  free: {
    name: "Free",
    description: "Build confidence with focused daily practice.",
    priceMonthly: "₱0",
    priceAnnual: "₱0",
    features: [
      "5 AI replies per day",
      "1 feedback report per day",
      "Beginner scenarios",
      "7 days of saved history",
    ],
  },
  pro: {
    name: "Pro",
    description: "Keep building progress with room to practise every day.",
    priceMonthly: "₱449",
    priceAnnual: "₱4,308",
    annualMonthlyEquivalent: "₱359",
    features: [
      "Unlimited AI replies",
      "Unlimited feedback reports",
      "Beginner, intermediate, and advanced scenarios",
      "Unlimited saved history",
      "Data export (JSON, CSV, PDF)",
    ],
  },
} as const;
