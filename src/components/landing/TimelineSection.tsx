import { useEffect, useRef, useState } from "react";
import { Zap, Settings, Plug, BarChart3 } from "lucide-react";
import RevealSection from "./RevealSection";

const steps = [
  { icon: <Zap className="w-5 h-5" />, time: "3 DIAS", title: "Diagnóstico e Mapeamento", desc: "Entendemos seu produto, perfil de lead ideal e regras de qualificação." },
  { icon: <Settings className="w-5 h-5" />, time: "5 DIAS", title: "Treinamento do Agente", desc: "Construímos o Agente com sua identidade de marca e fluxos de conversa." },
  { icon: <Plug className="w-5 h-5" />, time: "2 DIAS", title: "Integração e Ativação", desc: "Conectamos ao seu WhatsApp Business. Sem mudança para sua equipe." },
  { icon: <BarChart3 className="w-5 h-5" />, time: "CONTÍNUO", title: "Operação e Otimização", desc: "O Agente opera em tempo real. Nossa equipe refina continuamente." },
];

const LINE_FILL_MS = 800;
const CARD_REVEAL_MS = 400;

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
      { threshold: 0.2 }
    );
    obs.observe(el);

    // Fallback
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0 && !started.current) {
      started.current = true;
      runSequence();
    }

    return () => obs.disconnect();
  }, []);

  const runSequence = () => {
    let delay = 0;
    for (let i = 0; i < steps.length; i++) {
      // Reveal card i
      setTimeout(() => setActiveIndex(i), delay);
      delay += CARD_REVEAL_MS;
      // Start filling line from card i (if not last)
      if (i < steps.length - 1) {
        setTimeout(() => setLineFilling(i), delay);
        delay += LINE_FILL_MS;
      }
    }
  };

  return (
    <section className="py-20 sm:py-24 bg-[#030005] border-t border-white/[0.02] relative">
      <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
        <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3">
          Da contratação à<br />conversão em <span className="text-purple-500 font-playfair italic">menos de 2<br />semanas.</span>
        </h2>

        <div ref={sectionRef} className="mt-14 max-w-[600px]">
          {steps.map((s, i) => {
            const cardActive = i <= activeIndex;
            const lineFilled = i <= lineFilling;

            return (
              <div key={i} className="relative flex gap-6 sm:gap-10 pb-16 last:pb-0">
                {/* Left: icon + line */}
                <div className="flex flex-col items-center">
                  {/* Icon box */}
                  <div
                    className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-500 ${
                      cardActive
                        ? "border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.4)] scale-100"
                        : "border-white/[0.06] bg-white/[0.02] text-slate-700 scale-95"
                    }`}
                  >
                    {s.icon}
                  </div>

                  {/* Connecting line */}
                  {i < steps.length - 1 && (
                    <div className="w-px flex-1 bg-white/[0.04] relative mt-0 overflow-hidden">
                      <div
                        className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 via-purple-500 to-purple-400/20"
                        style={{
                          height: lineFilled ? "100%" : "0%",
                          transition: `height ${LINE_FILL_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Right: content */}
                <div
                  className={`pt-2 transition-all duration-500 ${
                    cardActive
                      ? "opacity-100 translate-y-0"
                      : "opacity-[0.15] translate-y-2"
                  }`}
                >
                  <span
                    className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider px-3 py-1 rounded-full mb-3 border transition-all duration-500 ${
                      cardActive
                        ? "text-purple-300 border-purple-500/40 bg-purple-500/10"
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
                      cardActive ? "text-white" : "text-slate-700"
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
      </RevealSection>
    </section>
  );
};

export default TimelineSection;
