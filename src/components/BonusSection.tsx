import { motion } from "framer-motion";
import { Gift, RefreshCw, Server, Sparkles, MessageCircle, Check } from "lucide-react";

const bonuses = [
  {
    icon: RefreshCw,
    title: "Protocolo 'Cliente Resgatado'",
    description: "Configuração completa do sistema de recuperação de clientes inativos. Transforme clientes perdidos em vendas.",
    value: "R$ 1500",
  },
  {
    icon: Server,
    title: "Infraestrutura Blindada",
    description: "Servidor grátis por 3 meses + Instalação em Servidor Próprio depois. Zero preocupação técnica.",
    value: "R$ 800",
  },
  {
    icon: Sparkles,
    title: "Subsídio Google Gemini",
    description: "6 meses de IA paga pelo criador. A inteligência artificial mais avançada, sem custo extra.",
    value: "R$ 600",
  },
  {
    icon: MessageCircle,
    title: "Suporte de 'Sócio'",
    description: "WhatsApp pessoal do criador por 6 meses. Suporte real, não robô de atendimento.",
    value: "R$ 1.500",
  },
];

const BonusSection = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Gradient background */}
      <div 
        className="absolute inset-0"
        style={{ background: "var(--gradient-bonus)" }}
      />
      <div className="absolute inset-0 bg-grid opacity-10" />
      
      <div className="container relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald/20 text-emerald mb-4">
            <Gift className="w-4 h-4" />
            <span className="text-sm font-semibold">Bônus Exclusivos</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Você Também Leva{" "}
            <span className="text-gradient-emerald">4 Presentes</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Mais de R$ 3.100 em bônus para garantir seu sucesso
          </p>
        </motion.div>

        {/* Bonus grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {bonuses.map((bonus, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="h-full rounded-2xl border border-emerald/20 bg-card/80 backdrop-blur-sm p-6 transition-all duration-300 hover:border-emerald/40">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 rounded-xl bg-emerald/20 flex items-center justify-center">
                      <bonus.icon className="w-7 h-7 text-emerald" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-lg font-bold">🎁 {bonus.title}</h3>
                      <span className="text-xs font-semibold text-emerald bg-emerald/20 px-2 py-1 rounded-full whitespace-nowrap">
                        Valor: {bonus.value}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{bonus.description}</p>
                    
                    {/* Checkmark */}
                    <div className="flex items-center gap-2 mt-3">
                      <Check className="w-4 h-4 text-emerald" />
                      <span className="text-xs text-emerald font-medium">Incluso no pacote</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Total value */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-emerald/30 bg-emerald/10">
            <Gift className="w-5 h-5 text-emerald" />
            <span className="text-lg font-bold">
              Total em Bônus:{" "}
              <span className="text-emerald">R$ 4.400,00</span>
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BonusSection;