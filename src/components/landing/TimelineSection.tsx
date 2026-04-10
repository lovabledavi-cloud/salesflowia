import { useEffect, useRef, useState } from "react";
import { Zap, Settings, Plug, BarChart3 } from "lucide-react";
import RevealSection from "./RevealSection";

const steps = [
  { icon: <Zap className="w-5 h-5" />, time: "3 DIAS", title: "Diagnóstico e Mapeamento", desc: "Entendemos seu produto, perfil de lead ideal e regras de qualificação." },
  { icon: <Settings className="w-5 h-5" />, time: "5 DIAS", title: "Treinamento do Agente", desc: "Construímos o Agente com sua identidade de marca e fluxos de conversa." },
  { icon: <Plug className="w-5 h-5" />, time: "2 DIAS", title: "Integração e Ativação", desc: "Conectamos ao seu WhatsApp Business. Sem mudança para sua equipe." },
  { icon: <BarChart3 className="w-5 h-5" />, time: "CONTÍNUO", title: "Operação e Otimização", desc: "O Agente opera em tempo real. Nossa equipe refina continuamente." },
];

const TimelineItem = ({ icon, time, title, desc, index }: { icon: React.ReactNode; time: string; title: string; desc: string; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold: 0.3, rootMargin: "0px 0px -80px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex gap-6 sm:gap-10 pb-16 last:pb-0">
      {/* Vertical line segment */}
      <div className="flex flex-col items-center">
        {/* Icon box */}
        <div className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 flex items-center justify-center shrink-0 transition-all duration-700 ${visible ? "border-purple-500 bg-purple-500/10 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]" : "border-white/10 bg-white/[0.02] text-slate-600"}`}>
          {icon}
        </div>
        {/* Line */}
        {index < steps.length - 1 && (
          <div className="w-px flex-1 bg-white/[0.06] relative mt-0">
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-purple-500 to-purple-500/30 transition-all duration-1000 ease-out"
              style={{ height: visible ? "100%" : "0%" }}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`pt-2 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <span className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold tracking-wider px-3 py-1 rounded-full mb-3 border transition-all duration-700 ${visible ? "text-purple-300 border-purple-500/40 bg-purple-500/10" : "text-slate-600 border-white/10 bg-white/[0.02]"}`}>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeWidth="2" d="M12 6v6l4 2"/></svg>
          {time}
        </span>
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed max-w-[400px]">{desc}</p>
      </div>
    </div>
  );
};

const TimelineSection = () => (
  <section className="py-20 sm:py-24 bg-[#030005] border-t border-white/[0.02] relative">
    <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%]">
      <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3">
        Da contratação à<br />conversão em <span className="text-purple-500 font-playfair italic">menos de 2<br/>semanas.</span>
      </h2>

      <div className="mt-14 max-w-[600px]">
        {steps.map((s, i) => (
          <TimelineItem key={i} {...s} index={i} />
        ))}
      </div>
    </RevealSection>
  </section>
);

export default TimelineSection;
