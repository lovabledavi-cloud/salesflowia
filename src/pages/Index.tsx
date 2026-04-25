import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MarqueeSection from "@/components/landing/MarqueeSection";
import PainPointsSection from "@/components/landing/PainPointsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TimelineSection from "@/components/landing/TimelineSection";
import MetricsSection from "@/components/landing/MetricsSection";
import ComparisonSection from "@/components/landing/ComparisonSection";
import CTASection from "@/components/landing/CTASection";
import SectionDivider from "@/components/landing/SectionDivider";

const Index = () => {
  return (
    <main className="relative min-h-screen bg-white text-slate-900 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Global ambient background effects */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute inset-0 bg-grid-light opacity-70" />
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full blur-[120px] opacity-40"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.35) 0%, transparent 70%)" }} />
        <div className="absolute top-[40%] -right-40 w-[600px] h-[600px] rounded-full blur-[140px] opacity-30"
          style={{ background: "radial-gradient(circle, rgba(249,115,22,0.3) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full blur-[130px] opacity-25"
          style={{ background: "radial-gradient(circle, rgba(251,146,60,0.35) 0%, transparent 70%)" }} />
      </div>

      <div className="relative z-10">
        <Navbar />
        <HeroSection />
      <MarqueeSection />
      <SectionDivider variant="glow" />
      <PainPointsSection />
      <SectionDivider variant="line" />
      <FeaturesSection />
      <SectionDivider variant="glow" />
      <TimelineSection />
      <SectionDivider variant="line" />
      <MetricsSection />
      <SectionDivider variant="glow" />
      <ComparisonSection />
      <SectionDivider variant="line" />
        <CTASection />
      </div>
    </main>
  );
};

export default Index;
