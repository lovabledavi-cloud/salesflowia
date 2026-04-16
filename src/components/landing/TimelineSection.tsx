import { useEffect, useRef, useState } from "react";
import { Zap, Settings, Plug, BarChart3, ArrowUpRight } from "lucide-react";
import RevealSection from "./RevealSection";

const steps = [
  { icon: <Zap className="w-5 h-5" />, time: "3 DIAS", title: "Diagnóstico e Mapeamento", desc: "Entendemos a operação do seu depósito, perfil de clientes e regras de qualificação." },
  { icon: <Settings className="w-5 h-5" />, time: "5 DIAS", title: "Treinamento do Agente", desc: "Construímos o Agente com a identidade do seu depósito e fluxos de conversa." },
  { icon: <Plug className="w-5 h-5" />, time: "2 DIAS", title: "Integração e Ativação", desc: "Conectamos ao WhatsApp do seu depósito. Sem mudança para sua equipe." },
  { icon: <BarChart3 className="w-5 h-5" />, time: "CONTÍNUO", title: "Operação e Otimização", desc: "O Agente opera em tempo real vendendo gás. Nossa equipe refina continuamente." },
];

const LINE_FILL_MS = 900;

const TimelineSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [lineFilling, setLineFilling] = useState(-1);
  const started = useRef(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          obs.unobserve(el);
          runSequence();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);

    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && !started.current) {
      started.current = true;
      runSequence();
    }

    return () => obs.disconnect();
  }, []);

  // Sequence: reveal card 0 → fill line 0 → reveal card 1 → fill line 1 → ...
  const runSequence = () => {
    let delay = 200;

    for (let i = 0; i < steps.length; i++) {
      // Reveal card i (line from previous card already reached it)
      const revealDelay = delay;
      setTimeout(() => setActiveIndex(i), revealDelay);

      // Start filling line FROM card i to next card
      if (i < steps.length - 1) {
        delay += 300; // small pause after card lights up
        const lineDelay = delay;
        setTimeout(() => setLineFilling(i), lineDelay);
        delay += LINE_FILL_MS; // wait for line to finish filling before next card
      }
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#030005] border-t border-white/[0.02] relative">
      <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
        <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3">
          Da contratação à<br />conversão em <span className="text-orange-500 font-playfair italic">menos de 2<br />semanas.</span>
        </h2>

        <div ref={sectionRef} className="mt-14 max-w-[600px]">
          {steps.map((s, i) => {
            const cardActive = i <= activeIndex;
            const lineActive = i <= lineFilling;

            return (
              <div key={i} className="relative flex gap-6 sm:gap-10">
                {/* Left column: icon + line */}
                <div className="flex flex-col items-center">
                  {/* Icon box */}
                  <div
                    className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                      cardActive
                        ? "border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] scale-100"
                        : "border-white/[0.06] bg-white/[0.02] text-slate-700 scale-95"
                    }`}
                  >
                    {s.icon}
                  </div>

                  {/* Line going down to next card */}
                  {i < steps.length - 1 && (
                    <div className="w-px bg-white/[0.04] relative overflow-hidden" style={{ height: "120px" }}>
                      <div
                        className="absolute top-0 left-0 w-full bg-orange-500"
                        style={{
                          height: lineActive ? "100%" : "0%",
                          transition: `height ${LINE_FILL_MS}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
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
                      : "opacity-[0.12] translate-y-2"
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider px-3 py-1 rounded-full mb-3 border transition-all duration-500 ${
                      cardActive
                        ? "text-orange-300 border-orange-500/40 bg-orange-500/10"
                        : "text-slate-700 border-white/[0.06] bg-transparent"
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
                      cardActive ? "text-white" : "text-slate-800"
                    }`}
                  >
                    {s.title}
                  </h3>
                  <p
                    className={`text-sm leading-relaxed max-w-[400px] transition-colors duration-500 ${
                      cardActive ? "text-slate-400" : "text-slate-800"
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
        <div className={`mt-14 text-center transition-all duration-700 delay-300 ${activeIndex >= steps.length - 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
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
