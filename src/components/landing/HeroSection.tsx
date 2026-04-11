import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

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
      <div className="absolute top-0 left-0 w-full h-screen z-0"
        style={{
          backgroundImage: "url('/images/hero_bg_v2.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(3,0,5,0.06) 0%, rgba(3,0,5,0.2) 46%, rgba(3,0,5,0.72) 82%, rgba(3,0,5,0.96) 100%)"
        }} />
      </div>

      <header ref={ref} className="reveal relative z-10 h-screen min-h-[600px] flex flex-col items-center justify-center text-center px-5 sm:px-[5%] max-w-[900px] mx-auto pt-24">
        <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-slate-400 mb-6 font-medium">
          Automação para Depósitos de Gás · WhatsApp Integrado
        </p>

        <h1 className="font-extrabold text-[clamp(1.8rem,4.5vw,3.2rem)] leading-[1.15] mb-6 max-w-[750px] text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
          A IA que recupera, vende e{" "}
          <span className="font-playfair italic font-bold text-purple-400">fideliza clientes</span>
          <br />
          no automático.
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-[520px] mb-8 leading-relaxed">
          Nossa Inteligência Artificial transforma seus cadastros parados em lucro recorrente, 
          sem aumentar seus custos.
        </p>

        <a
          href="#agendar"
          className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
          style={{
            background: "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          Fazer diagnóstico gratuito (2 min)
          <ArrowUpRight className="w-4 h-4" />
        </a>

        <p className="text-xs sm:text-sm text-slate-500 mt-4">
          Agende uma <em className="font-playfair text-slate-400">conversa rápida</em> e veja como escalar seu depósito.
        </p>

        <div className="mt-12 flex items-center justify-center gap-8 opacity-40">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-8 h-8 rounded-full border border-slate-600 flex items-center justify-center">
              <div className="w-4 h-4 bg-slate-500 rounded-full opacity-50" />
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default HeroSection;
