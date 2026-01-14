import { motion } from "framer-motion";
const StorySection = () => {
  return <section className="py-20 px-4 relative">
      <div className="container">
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true
      }} transition={{
        duration: 0.6
      }} className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 md:p-12">
            {/* Story text */}
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-violet/20 text-violet text-sm font-medium mb-6">
                Nossa História
              </span>
              <p className="text-lg md:text-xl leading-relaxed text-foreground/90">"Eu não sou uma empresa de software. Sou Gestor  de depósito, igual a você. Sei o que é chuva, motoqueiro faltando e a luta pra sobrar dinheiro. Criei esse sistema porque as agências não entendiam a nossa realidade."<span className="text-emerald font-semibold">não sou uma empresa de software</span>. 
                Sou dono de depósito, igual a você. Sei o que é chuva, motoqueiro faltando e a luta pra sobrar dinheiro. 
                <span className="text-violet font-semibold"> Criei esse sistema porque as agências não entendiam a nossa realidade.</span>"
              </p>
              
              <div className="flex items-center justify-center gap-4 mt-6">
                <div className="h-px flex-1 max-w-[100px] bg-border" />
                <span className="text-sm text-muted-foreground font-medium">De gestor para gestor</span>
                <div className="h-px flex-1 max-w-[100px] bg-border" />
              </div>
            </div>

            {/* Pain points */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8 border-t border-border">
              {[{
              emoji: "🌧️",
              text: "Dia de chuva sem pedido"
            }, {
              emoji: "🏍️",
              text: "Motoqueiro que falta"
            }, {
              emoji: "💸",
              text: "Mês que não sobra nada"
            }].map((item, index) => <motion.div key={index} initial={{
              opacity: 0,
              y: 20
            }} whileInView={{
              opacity: 1,
              y: 0
            }} viewport={{
              once: true
            }} transition={{
              delay: index * 0.1
            }} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <span className="text-2xl">{item.emoji}</span>
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </motion.div>)}
            </div>
          </div>
        </motion.div>
      </div>
    </section>;
};
export default StorySection;