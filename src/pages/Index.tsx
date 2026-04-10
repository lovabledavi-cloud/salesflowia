import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarqueeSection from "@/components/landing/MarqueeSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TimelineSection from "@/components/landing/TimelineSection";
import MetricsSection from "@/components/landing/MetricsSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import CTASection from "@/components/landing/CTASection";

const Index = () => {
  return (
    <main className="min-h-screen bg-[#030005] text-slate-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <MarqueeSection />
      <PainPointsSection />
      <FeaturesSection />
      <TimelineSection />
      <MetricsSection />
      <ComparisonSection />
      <CTASection />
    </main>
  );
};

export default Index;
