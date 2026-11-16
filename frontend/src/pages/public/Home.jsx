import { Hero } from "../../components/features/landing/Hero";
import { ServicesSection } from "../../components/features/landing/ServicesSection";
import { HowItWorks } from "../../components/features/landing/HowItWorks";
import { UseCases } from "../../components/features/landing/UseCases";
import { PricingPreview } from "../../components/features/landing/PricingPreview";
import { FaqSection } from "../../components/features/landing/FaqSection";
import { CtaBanner } from "../../components/features/landing/CtaBanner";

// The Home page is just the sections stacked in order. Each section lives in its own file.
export function Home() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <HowItWorks />
      <UseCases />
      <PricingPreview />
      <FaqSection />
      <CtaBanner />
    </>
  );
}