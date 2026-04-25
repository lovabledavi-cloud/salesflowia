import { useEffect, useRef, useState } from "react";
import { Zap, Settings, Plug, BarChart3, ArrowUpRight } from "lucide-react";
import RevealSection from "./RevealSection";

// Scroll-driven timeline: progress is tied directly to scroll position,
// so scrolling DOWN fills the cards/lines, and scrolling UP unfills them.

const steps = [
  { icon: <Zap className="w-5 h-5" />, time: "3 DIAS", title: "Diagnóstico e Mapeamento", desc: "Entendemos a operação do seu depósito, perfil de clientes e regras de qualificação." },
  { icon: <Settings className="w-5 h-5" />, time: "5 DIAS", title: "Treinamento do Agente", desc: "Construímos o Agente com a identidade do seu depósito e fluxos de conversa." },
  { icon: <Plug className="w-5 h-5" />, time: "2 DIAS", title: "Integração e Ativação", desc: "Conectamos ao WhatsApp do seu depósito. Sem mudança para sua equipe." },
  { icon: <BarChart3 className="w-5 h-5" />, time: "CONTÍNUO", title: "Operação e Otimização", desc: "O Agente opera em tempo real vendendo gás. Nossa equipe refina continuamente." },
];

const LINE_FILL_MS = 900;

const TimelineSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0 → steps.length

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.3;
      const total = rect.height + (start - end);
      const traveled = start - rect.top;
      const ratio = Math.max(0, Math.min(1, traveled / total));
      setProgress(ratio * steps.length);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="py-20 sm:py-24 bg-transparent relative">
      <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
        <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3 text-slate-900">
          Da contratação à<br />conversão em <span className="text-orange-500 font-playfair italic">menos de 2<br />semanas.</span>
        </h2>

        <div ref={sectionRef} className="mt-14 max-w-[600px]">
          {steps.map((s, i) => {
            const cardActive = progress > i + 0.4;
            const lineProgress = Math.max(0, Math.min(1, (progress - i - 0.4) / 0.6));

            return (
              <div key={i} className="relative flex gap-6 sm:gap-10">
                {/* Left column: icon + line */}
                <div className="flex flex-col items-center">
                  {/* Icon box */}
                  <div
                    className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                      cardActive
                        ? "border-orange-500 bg-orange-50 text-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.25)] scale-100"
                        : "border-slate-200 bg-slate-50 text-slate-300 scale-95"
                    }`}
                  >
                    {s.icon}
                  </div>

                  {/* Line going down to next card */}
                  {i < steps.length - 1 && (
                    <div className="w-px bg-slate-200 relative overflow-hidden" style={{ height: "120px" }}>
                      <div
                        className="absolute top-0 left-0 w-full bg-orange-500"
                        style={{
                          height: `${lineProgress * 100}%`,
                          transition: "height 150ms linear",
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Right: content */}
                <div
                  className={`pt-2 pb-16 transition-all duration-500 ${
                    cardActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-30 translate-y-2"
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider px-3 py-1 rounded-full mb-3 border transition-all duration-500 ${
                      cardActive
                        ? "text-orange-600 border-orange-300 bg-orange-50"
                        : "text-slate-400 border-slate-200 bg-transparent"
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                      <path strokeWidth="2" d="M12 6v6l4 2" />
                    </svg>
                    {s.time}
                  </span>
                  <h3
                    className={`text-lg sm:text-xl font-bold mb-2 transition-colors duration-500 ${
                      cardActive ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed max-w-[400px] transition-colors duration-500 ${
                      cardActive ? "text-slate-600" : "text-slate-300"
                    }`}
                  >
                    {s.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA after timeline */}
        <div className={`mt-14 text-center transition-all duration-700 ${progress >= steps.length - 0.3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <a
            href="#agendar"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(249,115,22,0.5)]"
            style={{
              background: "linear-gradient(135deg, #f97316 0%, #ea580c 50%, #c2410c 100%)",
              boxShadow: "0 6px 24px rgba(249,115,22,0.35)",
            }}
          >
            Quero meu diagnóstico gratuito <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </RevealSection>
    </section>
  );
};

export default TimelineSection;
