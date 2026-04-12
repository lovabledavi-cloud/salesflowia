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
      {/* Background - dark with subtle purple side glows like Datacrazy */}
      <div className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden" style={{ background: "#050010" }}>
        {/* Left vertical purple beam */}
        <div className="absolute" style={{
          top: "0%",
          left: "-5%",
          width: "30%",
          height: "100%",
          background: "linear-gradient(to right, rgba(120,40,220,0.15) 0%, rgba(100,30,180,0.06) 50%, transparent 100%)",
        }} />
        {/* Right vertical purple beam */}
        <div className="absolute" style={{
          top: "0%",
          right: "-5%",
          width: "30%",
          height: "100%",
          background: "linear-gradient(to left, rgba(120,40,220,0.15) 0%, rgba(100,30,180,0.06) 50%, transparent 100%)",
        }} />
        {/* Center subtle glow */}
        <div className="absolute" style={{
          top: "20%",
          left: "30%",
          width: "40%",
          height: "60%",
          background: "radial-gradient(ellipse at center, rgba(140,60,240,0.05) 0%, transparent 70%)",
          filter: "blur(80px)",
        }} />
        {/* Fine grain noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "128px 128px",
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

      {/* Black hole video - between sections, no black bg visible */}
      <div className="relative z-20 -mt-10 flex justify-center pointer-events-none overflow-hidden" style={{ height: "280px" }}>
        <div className="absolute w-[120%] max-w-[1000px]" style={{ top: "-40%" }}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-auto"
            style={{
              mixBlendMode: "screen",
              filter: "hue-rotate(270deg) saturate(1.2) brightness(0.85)",
            }}
          >
            <source src="/videos/blackhole.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
