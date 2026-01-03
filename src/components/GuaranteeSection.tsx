import { motion } from "framer-motion";
import { Shield, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GuaranteeSection = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-emerald/20 text-emerald text-sm font-medium mb-4">
            Risco Zero
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Garantia <span className="text-gradient-emerald">Dupla</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Sua segurança é nossa prioridade. Você não tem nada a perder.
          </p>
        </motion.div>

        {/* Guarantees grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Guarantee 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="h-full rounded-2xl border border-emerald/30 bg-card p-8 text-center">
              {/* Shield icon */}
              <div className="w-20 h-20 rounded-full bg-emerald/20 flex items-center justify-center mx-auto mb-6">
                <div className="w-14 h-14 rounded-full bg-emerald/30 flex items-center justify-center">
                  <Clock className="w-7 h-7 text-emerald" />
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald/20 text-emerald text-xs font-bold mb-4">
                <Shield className="w-3 h-3" />
                GARANTIA 1
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">7 Dias de Satisfação</h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                Satisfação total ou dinheiro de volta.{" "}
                <span className="text-emerald font-semibold">Sem perguntas.</span>{" "}
                Se por qualquer motivo você não ficar 100% satisfeito, devolvemos cada centavo.
              </p>
            </div>
          </motion.div>

          {/* Guarantee 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="h-full rounded-2xl border border-violet/30 bg-card p-8 text-center">
              {/* Shield icon */}
              <div className="w-20 h-20 rounded-full bg-violet/20 flex items-center justify-center mx-auto mb-6">
                <div className="w-14 h-14 rounded-full bg-violet/30 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-violet" />
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet/20 text-violet text-xs font-bold mb-4">
                <Shield className="w-3 h-3" />
                GARANTIA 2
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-3">90 Dias de Lucro Garantido</h3>

              {/* Description */}
              <p className="text-muted-foreground text-sm leading-relaxed">
                Se aplicar o protocolo e não lucrar{" "}
                <span className="text-violet font-semibold">R$ 2.000 extras em 90 dias</span>, 
                devolvo o dinheiro E deixo o sistema de graça. Simples assim.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            className="h-14 px-8 text-lg font-bold bg-emerald hover:bg-emerald-glow text-background glow-emerald transition-all duration-300 group"
          >
            Quero Começar Agora com Risco Zero
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default GuaranteeSection;