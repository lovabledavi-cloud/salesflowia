import { motion } from "framer-motion";
import { 
  Kanban, 
  Eye, 
  Megaphone, 
  BarChart3, 
  CalendarClock, 
  RotateCcw 
} from "lucide-react";

const features = [
  {
    icon: Kanban,
    title: "Pipeline em Tempo Real",
    description: "Esqueça a bagunça. Veja seus clientes num Kanban ao vivo: quem chegou, quem negocia e quem pagou. Organização gera caixa.",
    color: "emerald",
  },
  {
    icon: Eye,
    title: "Monitoramento Ao Vivo",
    description: "Veja a mágica acontecer. O painel mostra o que a IA fala em tempo real. Intervenha apenas se decidir. Transparência total.",
    color: "violet",
  },
  {
    icon: Megaphone,
    title: "Motor de Disparos",
    description: "Dia parado? Dispare uma oferta para 1.000 clientes simulando digitação humana. Recorde de vendas em minutos.",
    color: "emerald",
  },
  {
    icon: BarChart3,
    title: "Analytics e ROI",
    description: "Fim do achismo. O painel mostra Taxa de Entrega, Resposta e o Lucro exato. Pare de queimar dinheiro cego.",
    color: "violet",
  },
  {
    icon: CalendarClock,
    title: "Previsão de Recompra",
    description: "O sistema prevê quando o gás acaba e oferece reposição na hora exata. Venda antes do concorrente ligar.",
    color: "emerald",
  },
  {
    icon: RotateCcw,
    title: "O Recuperador Automático",
    description: "O cliente sumiu? O robô persegue a venda (1h depois, 24h depois...) quebrando objeções. Recupere 30% do faturamento perdido.",
    color: "violet",
  },
];

const SystemFeatures = () => {
  return (
    <section className="py-12 md:py-20 px-4 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 md:mb-16"
        >
          <span className="inline-block px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-violet/20 text-violet text-xs md:text-sm font-medium mb-3 md:mb-4">
            O Arsenal
          </span>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 px-2">
            6 Armas Para{" "}
            <span className="text-gradient-emerald">Dominar</span> Suas Vendas
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm md:text-base px-4">
            Ferramentas integradas para você escalar seu negócio de gás
          </p>
        </motion.div>

        {/* Features grid 3x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div 
                className={`relative h-full rounded-xl md:rounded-2xl border bg-slate-900/80 backdrop-blur-sm p-5 md:p-8 transition-all duration-500 overflow-hidden ${
                  feature.color === "emerald" 
                    ? "border-emerald/20 hover:border-emerald/50" 
                    : "border-violet/20 hover:border-violet/50"
                }`}
              >
                {/* Animated gradient background on hover */}
                <div 
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${
                    feature.color === "emerald"
                      ? "bg-gradient-to-br from-emerald/10 via-transparent to-emerald/5"
                      : "bg-gradient-to-br from-violet/10 via-transparent to-violet/5"
                  }`}
                />
                
                {/* Floating particles effect */}
                <div className={`absolute top-4 right-4 w-16 md:w-20 h-16 md:h-20 rounded-full blur-[40px] opacity-0 group-hover:opacity-60 transition-all duration-700 group-hover:scale-150 ${
                  feature.color === "emerald" ? "bg-emerald/30" : "bg-violet/30"
                }`} />
                
                <div className={`absolute bottom-4 left-4 w-12 md:w-16 h-12 md:h-16 rounded-full blur-[30px] opacity-0 group-hover:opacity-40 transition-all duration-500 delay-100 ${
                  feature.color === "emerald" ? "bg-emerald/20" : "bg-violet/20"
                }`} />

                {/* Icon with animated ring */}
                <div className="relative mb-4 md:mb-6">
                  <div 
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110 ${
                      feature.color === "emerald" 
                        ? "bg-emerald/20" 
                        : "bg-violet/20"
                    }`}
                  >
                    <feature.icon 
                      className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 group-hover:scale-110 ${
                        feature.color === "emerald" 
                          ? "text-emerald" 
                          : "text-violet"
                      }`} 
                    />
                  </div>
                </div>

                {/* Content */}
                <h3 className={`text-lg md:text-xl font-bold mb-2 md:mb-3 transition-colors duration-300 relative z-10 ${
                  feature.color === "emerald" 
                    ? "group-hover:text-emerald" 
                    : "group-hover:text-violet"
                }`}>
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10 group-hover:text-foreground/80 transition-colors duration-300 text-sm md:text-base">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 h-0.5 md:h-1 w-0 group-hover:w-full transition-all duration-500 ${
                  feature.color === "emerald" 
                    ? "bg-gradient-to-r from-emerald/80 to-emerald/20" 
                    : "bg-gradient-to-r from-violet/80 to-violet/20"
                }`} />

                {/* Corner accent */}
                <div className={`absolute top-0 right-0 w-12 md:w-16 h-12 md:h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                  feature.color === "emerald"
                    ? "bg-gradient-to-bl from-emerald/20 to-transparent"
                    : "bg-gradient-to-bl from-violet/20 to-transparent"
                }`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default SystemFeatures;
