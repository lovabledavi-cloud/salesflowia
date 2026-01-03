import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Bot, Sparkles, ChevronLeft, ChevronRight, Play } from "lucide-react";
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

const rotatingWords = ["Atende", "Vende Mais", "Recupera Clientes", "Aumenta o Faturamento"];

const HeroSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % dashboardImages.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + dashboardImages.length) % dashboardImages.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2500);
    return () => clearInterval(wordInterval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8 pb-20 px-4">
      {/* DataCrazy Style Background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-[10%] w-[500px] h-[500px] bg-violet/30 rounded-full blur-[150px] animate-orb" />
      <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-violet/20 rounded-full blur-[120px] animate-orb" style={{ animationDelay: "2s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-violet/10 rounded-full blur-[200px]" />
      
      <div className="container relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full glass-violet mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-violet animate-pulse" />
            <span className="text-sm font-medium text-foreground/90">Vagas de Fundador Abertas</span>
            <Sparkles className="w-4 h-4 text-violet" />
          </motion.div>

          {/* Headline - DataCrazy Style */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight"
          >
            <span className="text-gradient-white">Escale sua Revenda de Gás</span>
            <br />
            <span className="text-gradient-white">com a </span>
            <span className="text-gradient-violet">IA que </span>
            <span className="relative inline-block min-w-[280px] sm:min-w-[350px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-gradient-violet absolute left-0"
                >
                  {rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            O sistema de <span className="text-violet font-semibold">Inteligência Artificial</span> que atende, vende e fideliza clientes no WhatsApp sozinho.{" "}
            <span className="text-foreground font-medium">De dono de depósito para dono de depósito.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6"
          >
            <Button
              size="lg"
              className="h-14 px-8 text-lg font-bold bg-violet hover:bg-violet-glow text-foreground glow-violet transition-all duration-300 group w-full sm:w-auto"
            >
              <span className="hidden sm:inline">Quero Garantir Minha Vaga de Fundador</span>
              <span className="sm:hidden">Garantir Minha Vaga</span>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-14 px-8 text-lg font-medium border-border/50 hover:border-violet/50 hover:bg-violet/10 transition-all duration-300 group w-full sm:w-auto"
            >
              <Play className="mr-2 w-5 h-5 text-violet" />
              Ver Demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-sm text-muted-foreground"
          >
            🔒 Pagamento único • Sem mensalidades
          </motion.p>

          {/* Stats Row - DataCrazy Style */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6"
          >
            {[
              { value: "+300%", label: "Aumento em Vendas" },
              { value: "24/7", label: "Atendimento IA" },
              { value: "30 dias", label: "ROI Garantido" },
              { value: "+2.500", label: "Leads Recuperados" },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-card rounded-2xl p-4 md:p-6 hover-lift"
              >
                <div className="text-2xl md:text-3xl font-bold text-gradient-violet mb-1">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Dashboard Carousel */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-16 relative"
          >
            {/* Glow behind dashboard */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[80%] bg-violet/30 blur-[120px] rounded-full" />
            
            <div className="relative">
              <div className="relative z-20 flex items-center justify-center">
                {/* Previous Button */}
                <button
                  onClick={prevSlide}
                  className="absolute left-0 md:left-4 z-30 p-2 md:p-3 rounded-full glass-violet hover:bg-violet/20 transition-all duration-300 group"
                  aria-label="Imagem anterior"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-violet transition-colors" />
                </button>

                {/* Image Container */}
                <div className="relative w-full max-w-[900px] mx-8 md:mx-16 overflow-visible rounded-2xl">
                  {/* Gradient Border Effect */}
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-violet/50 via-violet/20 to-violet/50 rounded-2xl" />
                  <div className="absolute -inset-4 bg-gradient-to-r from-violet/20 via-transparent to-violet/20 rounded-3xl blur-xl" />
                  
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.4 }}
                      className="relative"
                    >
                      <img
                        src={dashboardImages[currentIndex].src}
                        alt={dashboardImages[currentIndex].alt}
                        className="relative w-full rounded-2xl shadow-2xl"
                        loading="eager"
                      />
                      {/* Label */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="absolute top-2 right-2 md:-top-3 md:-right-3 px-3 py-1.5 md:px-4 md:py-2 bg-violet text-foreground text-xs md:text-sm font-bold rounded-full shadow-lg glow-violet-sm"
                      >
                        {dashboardImages[currentIndex].label}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Next Button */}
                <button
                  onClick={nextSlide}
                  className="absolute right-0 md:right-4 z-30 p-2 md:p-3 rounded-full glass-violet hover:bg-violet/20 transition-all duration-300 group"
                  aria-label="Próxima imagem"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-violet transition-colors" />
                </button>
              </div>

              {/* Dots */}
              <div className="flex justify-center gap-2 mt-6">
                {dashboardImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? "w-8 bg-violet glow-violet-sm"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
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