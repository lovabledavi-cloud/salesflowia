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
      {/* Background image */}
      <div className="absolute top-0 left-0 w-full h-screen z-0"
        style={{
          backgroundImage: "url('/images/city_bg.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{
          background: "linear-gradient(to bottom, rgba(3,0,5,0.5) 0%, rgba(3,0,5,0.85) 50%, rgba(3,0,5,1) 100%)"
        }} />
      </div>

      <header ref={ref} className="reveal relative z-10 h-screen min-h-[700px] flex flex-col items-center justify-center text-center px-[5%] max-w-[1100px] mx-auto pt-20">
        {/* Top label */}
        <p className="text-[13px] tracking-[0.25em] uppercase text-slate-400 mb-8 font-medium">
          Infraestrutura de Vendas Autônoma · WhatsApp Integrado
        </p>

        {/* Headline */}
        <h1 className="font-extrabold text-[clamp(2.4rem,5.5vw,4.5rem)] leading-[1.15] mb-8 max-w-[900px] text-white" style={{ textShadow: "0 4px 20px rgba(0,0,0,0.6)" }}>
          A IA que qualifica e{" "}
          <span className="font-playfair italic font-bold text-purple-400">fecha leads</span>
          <br />
          enquanto sua equipe dorme.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg text-slate-400 max-w-[600px] mb-10 leading-relaxed">
          Todo o poder analítico para engajar e qualificar sua base 24h por dia,
          <br className="hidden sm:block" />
          sem precisar aumentar um real na folha de pagamento da sua
          <br className="hidden sm:block" />
          equipe comercial.
        </p>

        {/* CTA Button */}
        <a
          href="#agendar"
          className="inline-flex items-center gap-3 px-10 py-5 rounded-full text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_40px_rgba(168,85,247,0.5)]"
          style={{
            background: "linear-gradient(135deg, #a855f7 0%, #9333ea 50%, #7c3aed 100%)",
            boxShadow: "0 8px 32px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.15)",
          }}
        >
          Fazer diagnóstico gratuito (2 min)
          <ArrowUpRight className="w-5 h-5" />
        </a>

        {/* Sub-CTA text */}
        <p className="text-sm text-slate-500 mt-5">
          Agende uma <em className="font-playfair text-slate-400">conversa rápida</em> para alinhar expectativas.
        </p>

        {/* Client logos */}
        <div className="mt-16 flex items-center justify-center gap-10 opacity-40">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-10 h-10 rounded-full border border-slate-600 flex items-center justify-center">
              <div className="w-5 h-5 bg-slate-500 rounded-full opacity-50" />
            </div>
          ))}
        </div>
      </header>
    </div>
  );
};

export default HeroSection;
