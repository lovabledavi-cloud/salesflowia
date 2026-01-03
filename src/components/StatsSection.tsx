import { motion } from "framer-motion";
import { TrendingUp, Users, Zap, Award } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "+300%",
    label: "Aumento médio em vendas",
    description: "Nossos clientes triplicam o faturamento",
  },
  {
    icon: Users,
    value: "2.500+",
    label: "Leads recuperados",
    description: "Clientes que voltaram a comprar",
  },
  {
    icon: Zap,
    value: "24/7",
    label: "Atendimento automático",
    description: "IA trabalhando enquanto você descansa",
  },
  {
    icon: Award,
    value: "30 dias",
    label: "Retorno do investimento",
    description: "Garantia de ROI ou dinheiro de volta",
  },
];

const StatsSection = () => {
  return (
    <section className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet/5 to-background" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      
      <div className="container relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full p-6 rounded-2xl glass-card border-gradient hover-lift transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 rounded-xl bg-violet/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="w-6 h-6 text-violet" />
                </div>
                
                {/* Value */}
                <div className="text-4xl md:text-5xl font-bold text-gradient-violet mb-2">
                  {stat.value}
                </div>
                
                {/* Label */}
                <div className="text-foreground font-semibold mb-1">
                  {stat.label}
                </div>
                
                {/* Description */}
                <div className="text-sm text-muted-foreground">
                  {stat.description}
                </div>

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-violet/10 opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;