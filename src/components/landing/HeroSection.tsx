import { useEffect, useRef } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("active"); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="relative">
      {/* Background image */}
      <div className="absolute top-0 left-0 w-full h-screen z-0"
        style={{
          backgroundImage: "url('/images/city_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(3,0,5,0.4) 0%, rgba(3,0,5,0.85) 60%, rgba(3,0,5,1) 100%)"
        }} />
      </div>

      <header ref={ref} className="reveal relative z-10 h-screen min-h-[800px] flex flex-col items-center justify-center text-center px-[5%] max-w-[1200px] mx-auto pt-24">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold mb-10 text-purple-300 border border-purple-500/40 bg-white/[0.015] backdrop-blur-xl">
          <span className="w-2 h-2 bg-purple-300 rounded-full shadow-[0_0_10px_rgba(216,180,254,0.7)] animate-pulse" />
          Liberação Imediata
        </div>

        <h1 className="font-heading font-extrabold text-[clamp(2.8rem,6vw,5rem)] tracking-[-0.03em] leading-[1.1] mb-6 max-w-[1000px]" style={{ textShadow: "0 10px 30px rgba(0,0,0,0.8)" }}>
          Transforme seu Depósito<br />em uma<br />
          <span className="bg-gradient-to-br from-slate-50 to-purple-300 bg-clip-text text-transparent">
            Máquina de Vendas Automática.
          </span>
        </h1>

        <p className="text-lg text-slate-400 max-w-[700px] mb-12 font-normal" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>
          A primeira IA treinada para donos de distribuidoras de gás que atende nos três canais: Zap, Insta e Face.
        </p>

        <a href="#agendar" className="landing-glow-btn inline-flex items-center gap-2.5 px-10 py-5 rounded-full bg-purple-500 text-white font-semibold text-lg border border-white/20 hover:bg-purple-300 hover:text-gray-900 hover:-translate-y-0.5 transition-all">
          QUERO MEU DEPÓSITO NO PILOTO AUTOMÁTICO <ArrowRight className="w-5 h-5" />
        </a>

        <div className="absolute bottom-10 flex flex-col items-center gap-2 text-slate-400 text-sm animate-bounce">
          <p>Role para descobrir</p>
          <ChevronDown className="w-5 h-5" />
        </div>
      </header>
    </div>
  );
};

export default HeroSection;
