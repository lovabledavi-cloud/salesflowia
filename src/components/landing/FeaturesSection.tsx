import { TrendingUp, LayoutGrid, ShoppingCart, Kanban, BellRing, Plug } from "lucide-react";
import RevealSection from "./RevealSection";
import PhoneMockup from "./PhoneMockup";

const features = [
  { icon: <TrendingUp className="w-5 h-5" />, title: "Real Time Dashboard", desc: "Acompanhe métricas e relatórios de atendimentos em tempo real." },
  { icon: <LayoutGrid className="w-5 h-5" />, title: "Multicanal", desc: "Nossa IA atende clientes nas principais redes: WhatsApp, Facebook e Instagram." },
  { icon: <ShoppingCart className="w-5 h-5" />, title: "Fechamento Automático", desc: "A IA não apenas atende, ela Vende. Integrada com seu catálogo e preços." },
  { icon: <Kanban className="w-5 h-5" />, title: "CRM de Vendas", desc: "Controle total com visuais completos no Kanban de pedidos feitos." },
  { icon: <BellRing className="w-5 h-5" />, title: "Lembretes Inteligentes", desc: "Lembre os clientes de repor o gás depois de 30, 45 ou 60 dias." },
  { icon: <Plug className="w-5 h-5" />, title: "Integração Nativa", desc: "Pluga no seu banco de dados atual e sistema de gestão e estoque." },
];

const FeaturesSection = () => (
  <section className="py-24 bg-[#030005] border-t border-white/[0.02] overflow-hidden relative">
    {/* Purple glow */}
    <div className="absolute top-[30%] -right-24 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(168,85,247,0.4)_0%,transparent_60%)] blur-[80px] rounded-full opacity-50 pointer-events-none" />

    <RevealSection className="max-w-[1200px] mx-auto px-[5%] grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-28 items-center">
      <div>
        <span className="text-xs tracking-[2px] text-slate-500 mb-5 block font-space">ÚNICA FERRAMENTA</span>
        <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.5rem)] tracking-tight mb-4">
          Para <span className="text-purple-500 font-playfair">Dominar Suas Vendas</span><br />de ponta a ponta.
        </h2>
        <p className="text-lg text-slate-400 max-w-[480px] mb-12">
          Aumente seus lucros conectando todo seu ecossistema a uma IA focada exclusivamente em entregas de gás de cozinha e água.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 gap-x-6">
          {features.map((f, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="w-10 h-10 min-w-[40px] rounded-full bg-purple-500/5 border border-purple-500/15 flex items-center justify-center text-purple-500">
                {f.icon}
              </div>
              <div>
                <strong className="text-sm text-slate-200 block mb-1">{f.title}</strong>
                <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <PhoneMockup />
      </div>
    </RevealSection>
  </section>
);

export default FeaturesSection;
