import { TopNavBar } from "../components/landing/TopNavBar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { PlanComparison } from "../components/landing/PlanComparison";
import { ProgressReportPreview } from "../components/landing/ProgressReportPreview";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  return (
    <div className="bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavBar />
      <main id="main-content" className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <PlanComparison />
        <ProgressReportPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
