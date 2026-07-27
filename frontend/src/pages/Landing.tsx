import { useEffect } from "react";
import { TopNavBar } from "../components/landing/TopNavBar";
import { HeroSection } from "../components/landing/HeroSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HowItWorks } from "../components/landing/HowItWorks";
import { AnalyticsPreview } from "../components/landing/AnalyticsPreview";
import { Testimonials } from "../components/landing/Testimonials";
import { FinalCTA } from "../components/landing/FinalCTA";
import { Footer } from "../components/landing/Footer";

export function Landing() {
  useEffect(() => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
      section.classList.add(
        "transition-all",
        "duration-700",
        "opacity-0",
        "translate-y-10"
      );
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="bg-background font-sans text-foreground selection:bg-primary/20 selection:text-primary">
      <TopNavBar />
      <main className="pt-16">
        <HeroSection />
        <FeaturesSection />
        <HowItWorks />
        <AnalyticsPreview />
        <Testimonials />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
