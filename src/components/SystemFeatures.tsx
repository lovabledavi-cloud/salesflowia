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
    description: "Esqueça a bagunça. Veja seus clientes num Kanban ao vivo: quem chegou, quem negocia e quem pagou.",
  },
  {
    icon: Eye,
    title: "Monitoramento Ao Vivo",
    description: "Veja a mágica acontecer. O painel mostra o que a IA fala em tempo real. Transparência total.",
  },
  {
    icon: Megaphone,
    title: "Motor de Disparos",
    description: "Dia parado? Dispare uma oferta para 1.000 clientes simulando digitação humana.",
  },
  {
    icon: BarChart3,
    title: "Analytics e ROI",
    description: "Fim do achismo. O painel mostra Taxa de Entrega, Resposta e o Lucro exato.",
  },
  {
    icon: CalendarClock,
    title: "Previsão de Recompra",
    description: "O sistema prevê quando o gás acaba e oferece reposição na hora exata.",
  },
  {
    icon: RotateCcw,
    title: "Recuperador Automático",
    description: "O cliente sumiu? O robô persegue a venda quebrando objeções. Recupere 30% do perdido.",
  },
];

const SystemFeatures = () => {
  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-violet/15 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-violet text-violet text-sm font-medium mb-6">
            O Arsenal Completo
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            <span className="text-gradient-white">6 Armas Para </span>
            <span className="text-gradient-violet">Dominar</span>
            <span className="text-gradient-white"> Suas Vendas</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Ferramentas integradas para você escalar seu negócio de gás
          </p>
        </motion.div>

        {/* Features grid - DataCrazy Style Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full rounded-2xl glass-card p-6 md:p-8 transition-all duration-500 hover-lift overflow-hidden border-gradient">
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet/10 via-transparent to-violet/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glow on hover */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-violet/20 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-all duration-500" />

                {/* Icon */}
                <div className="relative mb-6">
                  <div className="w-14 h-14 rounded-xl bg-violet/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-violet/30">
                    <feature.icon className="w-7 h-7 text-violet transition-all duration-300" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-violet transition-colors duration-300 relative z-10">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed relative z-10 group-hover:text-foreground/80 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-violet/80 to-violet/20 transition-all duration-500" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SystemFeatures;