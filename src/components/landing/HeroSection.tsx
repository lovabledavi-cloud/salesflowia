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
      <div className="absolute top-0 left-0 w-full h-screen z-0 overflow-hidden bg-[#050304]">
        {/* Dotted grid texture (full background) */}
        <div
          className="absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 45%, #000 30%, transparent 80%)",
          }}
        />

        {/* LEFT vertical beam */}
        <div
          className="absolute top-0 bottom-0 left-0 w-[42%]"
          style={{
            background:
              "linear-gradient(to right, rgba(249,115,22,0.85) 0%, rgba(234,88,12,0.55) 18%, rgba(194,65,12,0.25) 45%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 left-0 w-[18%]"
          style={{
            background:
              "linear-gradient(to right, rgba(255,140,40,0.9) 0%, rgba(249,115,22,0.4) 50%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />

        {/* RIGHT vertical beam */}
        <div
          className="absolute top-0 bottom-0 right-0 w-[42%]"
          style={{
            background:
              "linear-gradient(to left, rgba(249,115,22,0.85) 0%, rgba(234,88,12,0.55) 18%, rgba(194,65,12,0.25) 45%, transparent 75%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute top-0 bottom-0 right-0 w-[18%]"
          style={{
            background:
              "linear-gradient(to left, rgba(255,140,40,0.9) 0%, rgba(249,115,22,0.4) 50%, transparent 100%)",
            filter: "blur(60px)",
          }}
        />

        {/* Center dark vignette to keep middle deep black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 70% at 50% 50%, rgba(5,3,4,0.95) 0%, rgba(5,3,4,0.7) 40%, transparent 75%)",
          }}
        />

        {/* Bottom horizon glow */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[280px]"
          style={{
            background:
              "radial-gradient(ellipse 70% 100% at 50% 100%, rgba(249,115,22,0.35) 0%, rgba(234,88,12,0.15) 40%, transparent 75%)",
          }}
        />

        {/* Top fade to black */}
        <div
          className="absolute top-0 left-0 right-0 h-[200px]"
          style={{
            background:
              "linear-gradient(to bottom, #050304 0%, transparent 100%)",
          }}
        />
      </div>

      <header ref={ref} className="reveal relative z-10 h-screen min-h-[600px] flex flex-col items-center justify-center text-center px-5 sm:px-[5%] max-w-[900px] mx-auto pt-24">
        <p className="text-[11px] sm:text-xs tracking-[0.2em] uppercase text-slate-400 mb-6 font-medium">
          Automação para Depósitos de Gás · WhatsApp Integrado
        </p>

        <h1 className="font-extrabold text-[clamp(1.8rem,4.5vw,3.2rem)] leading-[1.15] mb-6 max-w-[750px] text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
          A IA que recupera, vende e{" "}
          <span className="font-playfair italic font-bold text-orange-400">fideliza clientes</span>
          <br />
          no automático.
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-[520px] mb-8 leading-relaxed">
          Nossa Inteligência Artificial transforma seus cadastros parados em lucro recorrente, 
          sem aumentar seus custos.
        </p>

        <a
          href="#agendar"
          className="inline-flex items-center gap-2.5 px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-white font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(249,115,22,0.5)]"
          style={{
            background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
            boxShadow: "0 8px 32px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          Agende uma demonstração
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
