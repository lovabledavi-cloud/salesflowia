import { motion } from "framer-motion";
import { ArrowRight, Check, Sparkles, Users, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
const includes = [{
  text: "Plataforma SalesFlowIA (Licença White Label)",
  value: "R$ 6.200"
}, {
  text: "Desenvolvimento da IA de Vendas",
  value: "R$ 5.000"
}, {
  text: "Subsídio Google Gemini (3 Meses)",
  value: "R$ 600"
}, {
  text: "Consultoria de Tráfego & Funil",
  value: "R$ 1.500"
}, {
  text: "Suporte Técnico Prioritário (6 Meses)",
  value: "R$ 1.500"
}, {
  text: "Configuração de Servidor Dedicado",
  value: "R$ 800"
}];
const PricingCard = () => {
  return <section className="py-20 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald/10 rounded-full blur-[150px]" />
      
      <div className="container relative z-10">
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} className="max-w-xl mx-auto">
          {/* Pricing card */}
          <div className="relative rounded-3xl border-2 border-emerald/50 bg-card overflow-hidden pulse-glow">
            {/* Top banner */}
            <div className="bg-emerald text-background py-3 px-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold text-sm">PARCEIRO FUNDADOR — VAGAS LIMITADAS</span>
                <Sparkles className="w-4 h-4" />
              </div>
            </div>

            <div className="p-8 md:p-10">
              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet/20 text-violet text-xs font-medium">
                  <Users className="w-3.5 h-3.5" />
                  <span>Apenas 20 vagas</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald/20 text-emerald text-xs font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Oferta por tempo limitado</span>
                </div>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-foreground mb-2">O Que Você Leva:</h3>
                <p className="text-sm text-emerald font-medium">
                  Entregue com SUA LOGO e NOME DA SUA REVENDA. Autoridade total.
                </p>
              </div>

              {/* Includes list */}
              <div className="space-y-3 mb-8">
                {includes.map((item, index) => <motion.div key={index} initial={{
                opacity: 0,
                x: -20
              }} whileInView={{
                opacity: 1,
                x: 0
              }} viewport={{
                once: true
              }} transition={{
                delay: index * 0.08,
                type: "spring",
                stiffness: 100
              }} className="flex items-center justify-between gap-3 group">
                    <div className="flex items-center gap-3">
                      <motion.div initial={{
                    scale: 0
                  }} whileInView={{
                    scale: 1
                  }} viewport={{
                    once: true
                  }} transition={{
                    delay: index * 0.08 + 0.1,
                    type: "spring",
                    stiffness: 300
                  }} className="w-5 h-5 rounded-full bg-emerald/20 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald/30 transition-colors">
                        <Check className="w-3 h-3 text-emerald" />
                      </motion.div>
                      <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">{item.text}</span>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap group-hover:text-emerald/70 transition-colors">
                      {item.value}
                    </span>
                  </motion.div>)}
              </div>

              {/* Price */}
              <motion.div initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: 0.3
            }} className="text-center mb-8 pt-6 border-t border-border">
                <p className="text-muted-foreground mb-2">
                  Valor Total de Mercado:{" "}
                  <span className="line-through text-destructive">R$ 15.600,00</span>
                </p>
                <div className="flex items-center justify-center gap-2 relative">
                  {/* Glow effect behind price */}
                  <div className="absolute inset-0 bg-emerald/20 blur-3xl rounded-full scale-150" />
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald/0 via-emerald/30 to-emerald/0 blur-2xl animate-pulse" />
                  
                  <motion.span initial={{
                  opacity: 0,
                  x: -10
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.4
                }} className="text-2xl font-bold text-muted-foreground relative z-10">
                    R$
                  </motion.span>
                  <motion.span initial={{
                  opacity: 0,
                  scale: 0.5
                }} whileInView={{
                  opacity: 1,
                  scale: 1
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.5,
                  type: "spring",
                  stiffness: 200
                }} className="text-6xl md:text-7xl font-black text-gradient-emerald relative z-10 drop-shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                    2.997
                  </motion.span>
                  <motion.span initial={{
                  opacity: 0,
                  x: 10
                }} whileInView={{
                  opacity: 1,
                  x: 0
                }} viewport={{
                  once: true
                }} transition={{
                  delay: 0.6
                }} className="text-lg text-muted-foreground self-end mb-3 relative z-10">
                    ,00
                  </motion.span>
                </div>
                <motion.p initial={{
                opacity: 0
              }} whileInView={{
                opacity: 1
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.7
              }} className="text-emerald font-semibold mt-2">
                  Pagamento Único
                </motion.p>
                <motion.p initial={{
                opacity: 0
              }} whileInView={{
                opacity: 1
              }} viewport={{
                once: true
              }} transition={{
                delay: 0.8
              }} className="text-sm text-muted-foreground mt-1">Sem mensalidades</motion.p>
              </motion.div>

              {/* ROI argument */}
              <motion.div initial={{
              opacity: 0,
              scale: 0.9
            }} whileInView={{
              opacity: 1,
              scale: 1
            }} viewport={{
              once: true
            }} className="bg-emerald/10 border border-emerald/20 rounded-xl p-4 mb-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald/5 via-emerald/10 to-emerald/5 animate-[shimmer_3s_ease-in-out_infinite]" />
                <p className="text-center text-sm relative z-10">
                  <span className="text-emerald font-semibold">💰 Se Paga Sozinho:</span>{" "}
                  <span className="text-foreground/80">
                    Recupere 2 clientes por dia e o investimento volta em menos de 30 dias.
                  </span>
                </p>
              </motion.div>

              {/* CTA */}
              <Button size="lg" className="w-full h-12 sm:h-14 text-sm sm:text-lg font-bold bg-emerald hover:bg-emerald-glow text-background transition-all duration-300 group">
                <span className="hidden sm:inline">Quero Lucrar com Automação Agora</span>
                <span className="sm:hidden">Lucrar com Automação</span>
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              {/* Security badges */}
              <div className="flex items-center justify-center gap-4 mt-6 text-muted-foreground">
                <div className="flex items-center gap-1.5 text-xs">
                  <Shield className="w-4 h-4" />
                  <span>Pagamento Seguro</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-border" />
                <div className="flex items-center gap-1.5 text-xs">
                  <Check className="w-4 h-4" />
                  <span>Garantia de 7 dias</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default PricingCard;