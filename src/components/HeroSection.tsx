import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageSquare, Bot, BarChart3, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import dashboardCampaigns from "@/assets/dashboard-campaigns.png";
import dashboardPipeline from "@/assets/dashboard-pipeline.png";
import dashboardVendas from "@/assets/dashboard-vendas.png";
import dashboardFollowup from "@/assets/dashboard-followup.png";

const dashboardImages = [
  { src: dashboardVendas, alt: "Dashboard Vendas IA - Análise em tempo real", label: "Vendas" },
  { src: dashboardPipeline, alt: "Pipeline IA - Gestão de leads automatizada", label: "Pipeline" },
  { src: dashboardCampaigns, alt: "Disparador de Campanhas - Automação WhatsApp", label: "Campanhas" },
  { src: dashboardFollowup, alt: "Follow-up Automático - Recuperação de vendas", label: "Follow-up" },
];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % dashboardImages.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + dashboardImages.length) % dashboardImages.length);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-hero)" }}
      />
      
      {/* Floating orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-violet/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: "1s" }} />
      
      <div className="container relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 backdrop-blur-sm mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald animate-pulse" />
            <span className="text-sm text-muted-foreground">Vagas de Fundador Abertas</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight mb-6"
          >
            Transforme seu Depósito em uma{" "}
            <span className="text-gradient-emerald">Máquina de Vendas</span>{" "}
            Automática.
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            O sistema de <span className="text-violet font-semibold">Inteligência Artificial</span> que atende, vende e fideliza clientes no WhatsApp sozinho.{" "}
            <span className="text-foreground font-medium">De dono de depósito para dono de depósito.</span>
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              size="lg" 
              className="h-12 sm:h-14 px-4 sm:px-8 text-sm sm:text-lg font-bold bg-emerald hover:bg-emerald-glow text-background glow-emerald transition-all duration-300 group w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Quero Garantir Minha Vaga de Fundador</span>
              <span className="sm:hidden">Garantir Minha Vaga</span>
              <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              🔒 Pagamento único • Sem mensalidade por 6 meses
            </p>
          </motion.div>

          {/* Visual Flow */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 relative"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              {/* WhatsApp */}
              <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-border">
                <div className="w-12 h-12 rounded-full bg-emerald/20 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-emerald" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-muted-foreground">Cliente chega</p>
                </div>
              </div>

              {/* Arrow */}
              <Zap className="w-6 h-6 text-violet rotate-90 sm:rotate-0" />

              {/* IA */}
              <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-violet/30 glow-violet">
                <div className="w-12 h-12 rounded-full bg-violet/20 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-violet" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-violet">IA SalesFlow</p>
                  <p className="text-sm text-muted-foreground">Atende e vende</p>
                </div>
              </div>

              {/* Arrow */}
              <Zap className="w-6 h-6 text-emerald rotate-90 sm:rotate-0" />

              {/* Dashboard */}
              <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-card border border-emerald/30">
                <div className="w-12 h-12 rounded-full bg-emerald/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-emerald" />
                </div>
                <div className="text-left">
                  <p className="font-semibold">Dashboard</p>
                  <p className="text-sm text-muted-foreground">Você lucra</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dashboard Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-20 relative"
          >
            {/* Glow behind main dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[60%] bg-emerald/20 blur-[100px] rounded-full" />
            
            <div className="relative">
              {/* Main Carousel */}
              <div className="relative z-20 flex items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 md:left-4 z-30 p-2 md:p-3 rounded-full bg-card/80 border border-border hover:bg-card hover:border-violet/50 transition-all duration-300 backdrop-blur-sm group"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-violet transition-colors" />
                </button>

                {/* Image Container */}
                <div className="relative w-full max-w-[800px] mx-8 md:mx-16 overflow-visible rounded-xl">
                  <div className="absolute -inset-4 bg-gradient-to-r from-emerald/20 via-violet/20 to-emerald/20 rounded-2xl blur-xl" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="relative"
                    >
                      <img 
                        src={dashboardImages[currentIndex].src} 
                        alt={dashboardImages[currentIndex].alt}
                        className="relative w-full rounded-xl border-2 border-emerald/40 shadow-2xl shadow-emerald/30"
                      />
                      {/* Floating label */}
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-2 right-2 md:-top-4 md:-right-4 px-3 py-1.5 md:px-4 md:py-2 bg-emerald text-background text-xs md:text-sm font-bold rounded-full shadow-lg"
                      >
                        {dashboardImages[currentIndex].label}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="absolute right-0 md:right-4 z-30 p-2 md:p-3 rounded-full bg-card/80 border border-border hover:bg-card hover:border-violet/50 transition-all duration-300 backdrop-blur-sm group"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-violet transition-colors" />
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {dashboardImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? "w-8 bg-emerald" 
                        : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Ir para imagem ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
