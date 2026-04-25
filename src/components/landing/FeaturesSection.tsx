import { TrendingUp, LayoutGrid, ShoppingCart, Kanban, BellRing, Plug } from "lucide-react";
import RevealSection from "./RevealSection";
import PhoneMockup from "./PhoneMockup";

const features = [
  { icon: <TrendingUp className="w-4 h-4" />, title: "Real Time Dashboard", desc: "Métricas e relatórios de atendimentos em tempo real." },
  { icon: <LayoutGrid className="w-4 h-4" />, title: "Multicanal", desc: "WhatsApp, Facebook e Instagram integrados." },
  { icon: <ShoppingCart className="w-4 h-4" />, title: "Fechamento Automático", desc: "A IA vende, integrada ao seu catálogo." },
  { icon: <Kanban className="w-4 h-4" />, title: "CRM de Vendas", desc: "Kanban completo de pedidos do depósito." },
  { icon: <BellRing className="w-4 h-4" />, title: "Lembretes Inteligentes", desc: "Reposição automática de botijão em 30, 45 ou 60 dias." },
  { icon: <Plug className="w-4 h-4" />, title: "Integração Nativa", desc: "Conecta ao sistema de gestão do seu depósito." },
];

const FeaturesSection = () => (
  <section className="py-20 sm:py-24 bg-transparent overflow-hidden relative">
    <div className="absolute top-[30%] -right-24 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(249,115,22,0.18)_0%,transparent_60%)] blur-[80px] rounded-full opacity-60 pointer-events-none" />

    <RevealSection className="max-w-[1000px] mx-auto px-5 sm:px-[5%] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-12 lg:gap-20 items-center">
      <div>
        <span className="text-[10px] sm:text-xs tracking-[2px] text-slate-500 mb-4 block font-space">SEU PARCEIRO ESTRATÉGICO PARA</span>
        <h2 className="font-extrabold text-[clamp(1.6rem,3.5vw,2.5rem)] tracking-tight mb-3 text-slate-900">
          <span className="text-orange-500 font-playfair italic">vendas escaláveis.</span>
        </h2>
        <p className="text-sm sm:text-base text-slate-600 max-w-[420px] mb-8">
          Aumente o faturamento do seu depósito conectando todo seu ecossistema a uma IA focada em resultados.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 gap-x-5">
          {features.map((f, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-8 h-8 min-w-[32px] rounded-lg bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-500">
                {f.icon}
              </div>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 block mb-0.5">{f.title}</strong>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center">
        <PhoneMockup />
      </div>
    </RevealSection>
  </section>
);

export default FeaturesSection;
