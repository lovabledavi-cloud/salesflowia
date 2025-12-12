import Logo from "@/components/Logo";
import HeroSection from "@/components/HeroSection";
import StorySection from "@/components/StorySection";
import SystemFeatures from "@/components/SystemFeatures";
import BonusSection from "@/components/BonusSection";
import PriceAnchor from "@/components/PriceAnchor";
import PricingCard from "@/components/PricingCard";
import GuaranteeSection from "@/components/GuaranteeSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen bg-background overflow-hidden">
      {/* Header with Logo */}
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-8 bg-background/80 backdrop-blur-md border-b border-border/50">
        <div className="container flex items-center justify-between">
          <Logo size="md" />
          <a 
            href="#pricing" 
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/10 text-emerald text-sm font-medium hover:bg-emerald/20 transition-colors"
          >
            Garantir Vaga
          </a>
        </div>
      </header>
      
      <div className="pt-16">
        <HeroSection />
        <StorySection />
        <SystemFeatures />
        <BonusSection />
        <PriceAnchor />
        <PricingCard />
        <GuaranteeSection />
        <Footer />
      </div>
    </main>
  );
};

export default Index;