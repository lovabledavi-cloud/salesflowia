import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState, useRef } from "react";

const testimonials = [
  {
    name: "Carlos Silva",
    role: "Dono de Depósito - SP",
    text: "Aumentei minhas vendas em 40% no primeiro mês! A IA atende melhor que qualquer funcionário.",
    avatar: "CS"
  },
  {
    name: "Roberto Santos",
    role: "Revenda de Gás - MG",
    text: "Finalmente consigo descansar! O sistema funciona 24h e os clientes adoram a rapidez.",
    avatar: "RS"
  },
  {
    name: "Ana Paula",
    role: "Distribuidora - RJ",
    text: "Recuperei mais de R$ 8.000 em clientes inativos só no primeiro mês. Incrível!",
    avatar: "AP"
  },
  {
    name: "José Ferreira",
    role: "Depósito Central - BA",
    text: "Antes perdia pedidos de madrugada. Agora a IA captura tudo e ainda agenda entrega.",
    avatar: "JF"
  },
  {
    name: "Maria Costa",
    role: "Revenda Express - PR",
    text: "O follow-up automático é genial. Nunca mais esqueci de contatar um cliente!",
    avatar: "MC"
  },
  {
    name: "Pedro Lima",
    role: "Gas & Água - SC",
    text: "Reduzi 3 funcionários e ainda vendo mais. O ROI foi no primeiro mês.",
    avatar: "PL"
  },
  {
    name: "Fernanda Oliveira",
    role: "Depósito Norte - AM",
    text: "A IA entende gírias e resolve problemas sozinha. Parece magia!",
    avatar: "FO"
  },
  {
    name: "Lucas Mendes",
    role: "Revenda Top Gás - GO",
    text: "Meus concorrentes não sabem como respondo tão rápido. Segredo guardado!",
    avatar: "LM"
  }
];

const TestimonialsSection = () => {
  const autoplayPlugin = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      dragFree: true,
    },
    [autoplayPlugin.current]
  );

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <section className="py-16 md:py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 md:mb-12 px-4 relative z-10"
      >
        <span className="inline-block px-4 py-1.5 rounded-full bg-violet/20 text-violet text-sm font-medium mb-4">
          Depoimentos Reais
        </span>
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4">
          O Que Nossos <span className="text-gradient-violet">Clientes</span> Dizem
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
          Donos de depósito como você que já estão lucrando mais
        </p>
      </motion.div>

      {/* Carousel container */}
      <div className="relative px-4 md:px-12">
        {/* Gradient fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        {/* Gradient fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-8 md:w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Navigation arrows - Desktop only */}
        <button
          onClick={scrollPrev}
          className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-card/80 border border-border/50 text-foreground hover:bg-violet/20 hover:border-violet/30 transition-all duration-200"
          aria-label="Anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollNext}
          className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 items-center justify-center rounded-full bg-card/80 border border-border/50 text-foreground hover:bg-violet/20 hover:border-violet/30 transition-all duration-200"
          aria-label="Próximo"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Embla Carousel */}
        <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
          <div className="flex">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[85%] sm:w-[45%] md:w-[32%] lg:w-[24%] min-w-0 pl-3 md:pl-4"
              >
                <div className="p-4 md:p-5 rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm hover:border-violet/30 transition-colors duration-300 h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-violet to-emerald flex items-center justify-center text-background text-sm font-bold flex-shrink-0">
                      {testimonial.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground text-sm md:text-base truncate">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-foreground/80 leading-relaxed text-sm">"{testimonial.text}"</p>
                  {/* Stars */}
                  <div className="flex gap-0.5 mt-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-yellow-400 text-sm">★</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile hint */}
        <p className="md:hidden text-center text-xs text-muted-foreground mt-4">
          ← Arraste para ver mais →
        </p>
      </div>
    </section>
  );
};

export default TestimonialsSection;
