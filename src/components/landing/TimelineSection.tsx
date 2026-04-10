import { useEffect, useRef } from "react";
import RevealSection from "./RevealSection";

const steps = [
  { step: "CAPTURA", title: "O Lead Solicita Gás ou Água", desc: "O cliente nota que o gás acabou e dispara uma mensagem via WhatsApp, Insta ou Face da sua revenda." },
  { step: "QUALIFICAÇÃO", title: "Bate-papo Inteligente", desc: "A IA pega o endereço (com localização GPS), marca, confirma pagamento via PIX, dinheiro ou cartão." },
  { step: "FILTRO", title: "Verificação de Estoque Local", desc: "Apenas em milissegundos a IA consulta seu banco do estoque nativo, confirmando que o motoboy pode levar a botija certa." },
  { step: "CONVERSÃO", title: "Pedido no Aplicativo", desc: "Seu entregador recebe no painel a rota exata com o pedido 100% fechado pela IA. Zero tempo perdido no atendimento!" },
];

const TimelineItem = ({ step, title, desc, index, isLast }: { step: string; title: string; desc: string; index: number; isLast: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { el.classList.add("active"); obs.unobserve(el); } },
      { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="timeline-item relative pl-[70px] mb-10 last:mb-0 opacity-0 -translate-x-5 transition-all duration-600 [&.active]:opacity-100 [&.active]:translate-x-0">
      <div className={`absolute left-[10px] top-2.5 w-[30px] h-[30px] rounded-full border-2 border-purple-500 flex items-center justify-center font-bold text-sm z-[2] ${isLast ? "bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,1)]" : "bg-[#0a0510] text-purple-500"}`}>
        {index + 1}
      </div>
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-8 border-l-4 border-l-transparent hover:border-l-purple-500 hover:translate-x-1 transition-all">
        <span className="font-space font-bold tracking-wider text-xs text-purple-500 block mb-2">{step}</span>
        <h3 className="font-heading text-2xl font-extrabold mb-2.5">{title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
      </div>
    </div>
  );
};

const TimelineSection = () => (
  <section className="py-24 bg-[#030005] border-t border-white/[0.02] relative">
    <RevealSection className="max-w-[1200px] mx-auto px-[5%]">
      <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.5rem)] tracking-tight mb-4">
        Da prospecção à<br />entrega em <span className="text-purple-500 font-playfair italic">tempo recorde.</span>
      </h2>

      <div className="relative max-w-[800px] mx-auto mt-16">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-purple-500/10" />
        {steps.map((s, i) => (
          <TimelineItem key={i} {...s} index={i} isLast={i === steps.length - 1} />
        ))}
      </div>
    </RevealSection>
  </section>
);

export default TimelineSection;
