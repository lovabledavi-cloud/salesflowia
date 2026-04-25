import { TrendingUp, LayoutGrid, ShoppingCart, Kanban, BellRing, Plug } from "lucide-react";
import { motion } from "framer-motion";
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
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -40, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.4 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
              className="group flex gap-3 items-start cursor-default p-2 -m-2 rounded-xl hover:bg-orange-50/40 transition-colors duration-300"
            >
              <motion.div
                initial={{ rotate: -90, scale: 0 }}
                whileInView={{ rotate: 0, scale: 1 }}
                viewport={{ once: false, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.1 + 0.15, type: "spring", stiffness: 200 }}
                className="w-9 h-9 min-w-[36px] rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[0_4px_12px_-2px_rgba(249,115,22,0.5)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300"
              >
                {f.icon}
              </motion.div>
              <div>
                <strong className="text-xs sm:text-sm text-slate-900 block mb-0.5 group-hover:text-orange-600 transition-colors duration-300">{f.title}</strong>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, x: 200, rotate: 90, scale: 0.6 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{
          duration: 1.1,
          ease: [0.16, 1, 0.3, 1],
          rotate: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] },
        }}
      >
        <PhoneMockup />
      </motion.div>
    </RevealSection>
  </section>
);

export default FeaturesSection;
