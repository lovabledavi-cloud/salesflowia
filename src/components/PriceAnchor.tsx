import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { X, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const priceItems = [
  { item: "Plataforma SalesFlowIA (Licença White Label)", price: "R$ 6.200,00" },
  { item: "Desenvolvimento da IA de Vendas", price: "R$ 5.000,00" },
  { item: "Subsídio Google Gemini (3 Meses)", price: "R$ 600,00" },
  { item: "Consultoria de Tráfego & Funil", price: "R$ 1.500,00" },
  { item: "Suporte Técnico Prioritário (6 Meses)", price: "R$ 1.500,00" },
  { item: "Configuração de Servidor Dedicado", price: "R$ 800,00" },
];

const AnimatedCounter = ({ value, inView }: { value: number; inView: boolean }) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => {
    return latest.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  });
  const [displayValue, setDisplayValue] = useState("0,00");

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: "easeOut",
      });
      
      const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
      
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [inView, value, count, rounded]);

  return <span>R$ {displayValue}</span>;
};

const PriceAnchor = () => {
  const [isInView, setIsInView] = useState(false);
  const totalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (totalRef.current) {
      observer.observe(totalRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 px-4 relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          {/* Section header */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium mb-4">
              Comparativo de Valor
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Quanto Custaria{" "}
              <span className="text-muted-foreground">Fazer do Zero?</span>
            </h2>
          </div>

          {/* Price list */}
          <div className="rounded-2xl border border-border bg-slate-900/80 backdrop-blur-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="space-y-4">
                {priceItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <Check className="w-4 h-4 text-emerald" />
                      </div>
                      <span className="text-foreground/80">{item.item}</span>
                    </div>
                    <span className="font-semibold text-muted-foreground">{item.price}</span>
                  </motion.div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-border my-6" />

              {/* Total */}
              <motion.div
                ref={totalRef}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center justify-between"
              >
                <span className="text-lg font-bold">TOTAL DE MERCADO:</span>
                <div className="relative">
                  <span className="text-2xl md:text-3xl font-black text-muted-foreground strikethrough">
                    <AnimatedCounter value={15600} inView={isInView} />
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Bottom banner */}
            <div className="bg-destructive/10 border-t border-destructive/20 p-4">
              <div className="flex items-center justify-center gap-2">
                <X className="w-5 h-5 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  Você NÃO vai pagar isso
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PriceAnchor;
