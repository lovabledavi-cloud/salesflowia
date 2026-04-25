import { Clock, CalendarX, Filter } from "lucide-react";
import RevealSection from "./RevealSection";

const cards = [
  {
    icon: <Clock className="w-5 h-5" />,
    title: "Agente Inteligente",
    desc: "Atendimento em segundos para seu depósito. Humanizado ou robótico, você escolhe. Atende Facebook, Web, Insta e WhatsApp simultaneamente.",
  },
  {
    icon: <CalendarX className="w-5 h-5" />,
    title: "Vendas e Recorrência",
    desc: "Cliente que comprou gás hoje tem anotação visual. O sistema sabe quando o botijão acaba e entra em contato automaticamente.",
  },
  {
    icon: <Filter className="w-5 h-5" />,
    title: "Resgate Automático",
    desc: "Recuperamos toda a base inativa do seu depósito com mensagens assertivas para quem precisa de gás.",
  },
];

const PainPointsSection = () => (
  <section className="py-24 bg-white border-t border-slate-100">
    <RevealSection className="max-w-[1200px] mx-auto px-[5%]">
      <div className="text-center mb-16">
        <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.5rem)] tracking-tight mb-4 text-slate-900">
          Como transformamos clientes<br />
          <span className="text-orange-500" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600 }}>"esquecidos"</span> em lucro pro seu depósito
        </h2>
        <p className="text-lg text-slate-600">Seu depósito não precisa de mais atendentes, precisa de inteligência artificial com trato humano.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col gap-4 transition-all hover:border-orange-500/60 hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(15,23,42,0.08)]">
            <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500 mb-2">
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
            <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>
          </div>
        ))}
      </div>
    </RevealSection>
  </section>
);

export default PainPointsSection;
