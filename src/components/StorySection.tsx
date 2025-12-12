import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const StorySection = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12">
            {/* Quote icon */}
            <div className="absolute -top-6 left-8 w-12 h-12 rounded-full bg-violet flex items-center justify-center">
              <Quote className="w-6 h-6 text-foreground" />
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Photo placeholder */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gradient-to-br from-violet/30 to-emerald/30 border-2 border-border flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-2 flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Criador</p>
                  </div>
                </div>
              </div>

              {/* Story text */}
              <div className="flex-1">
                <p className="text-lg md:text-xl leading-relaxed text-foreground/90 mb-6">
                  "Eu <span className="text-emerald font-semibold">não sou uma empresa de software</span>. 
                  Sou dono de depósito, igual a você. Sei o que é chuva, motoqueiro faltando e a luta pra sobrar dinheiro. 
                  <span className="text-violet font-semibold"> Criei esse sistema porque as agências não entendiam a nossa realidade.</span>"
                </p>
                
                <div className="flex items-center gap-4">
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-sm text-muted-foreground font-medium">
                    De dono para dono
                  </span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              </div>
            </div>

            {/* Pain points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
              {[
                { emoji: "🌧️", text: "Dia de chuva sem pedido" },
                { emoji: "🏍️", text: "Motoqueiro que falta" },
                { emoji: "💸", text: "Mês que não sobra nada" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                >
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StorySection;