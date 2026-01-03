import Logo from "@/components/Logo";
import HeroSection from "@/components/HeroSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import StorySection from "@/components/StorySection";
import SystemFeatures from "@/components/SystemFeatures";
import BonusSection from "@/components/BonusSection";
import PriceAnchor from "@/components/PriceAnchor";
import PricingCard from "@/components/PricingCard";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import Footer from "@/components/Footer";
import StatsSection from "@/components/StatsSection";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Header with Logo */}
      <header className="py-4 px-4 md:px-8 bg-background/80 backdrop-blur-xl border-b border-border/30 sticky top-0 z-50">
        <div className="container flex items-center justify-center md:justify-between">
          <Logo size="lg" />
          <a 
            href="#pricing" 
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-violet/20 text-violet text-sm font-medium hover:bg-violet/30 transition-colors border border-violet/30"
          >
            Garantir Vaga
          </a>
        </div>
      </header>
      
      <div>
        <HeroSection />
        <StatsSection />
        <HowItWorksSection />
        <SystemFeatures />
        <TestimonialsSection />
        <BonusSection />
        <PriceAnchor />
        <PricingCard />
        <GuaranteeSection />
        <StorySection />
        <FAQSection />
        <Footer />
      </div>
    </main>
  );
};

export default Index;