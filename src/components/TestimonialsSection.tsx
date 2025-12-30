import { motion } from "framer-motion";
const testimonials = [{
  name: "Carlos Silva",
  role: "Dono de Depósito - SP",
  text: "Aumentei minhas vendas em 40% no primeiro mês! A IA atende melhor que qualquer funcionário.",
  avatar: "CS"
}, {
  name: "Roberto Santos",
  role: "Revenda de Gás - MG",
  text: "Finalmente consigo descansar! O sistema funciona 24h e os clientes adoram a rapidez.",
  avatar: "RS"
}, {
  name: "Ana Paula",
  role: "Distribuidora - RJ",
  text: "Recuperei mais de R$ 8.000 em clientes inativos só no primeiro mês. Incrível!",
  avatar: "AP"
}, {
  name: "José Ferreira",
  role: "Depósito Central - BA",
  text: "Antes perdia pedidos de madrugada. Agora a IA captura tudo e ainda agenda entrega.",
  avatar: "JF"
}, {
  name: "Maria Costa",
  role: "Revenda Express - PR",
  text: "O follow-up automático é genial. Nunca mais esqueci de contatar um cliente!",
  avatar: "MC"
}, {
  name: "Pedro Lima",
  role: "Gas & Água - SC",
  text: "Reduzi 3 funcionários e ainda vendo mais. O ROI foi no primeiro mês.",
  avatar: "PL"
}, {
  name: "Fernanda Oliveira",
  role: "Depósito Norte - AM",
  text: "A IA entende gírias e resolve problemas sozinha. Parece magia!",
  avatar: "FO"
}, {
  name: "Lucas Mendes",
  role: "Revenda Top Gás - GO",
  text: "Meus concorrentes não sabem como respondo tão rápido. Segredo guardado!",
  avatar: "LM"
}];

// Duplicate for infinite effect
const duplicatedTestimonials = [...testimonials, ...testimonials];
const TestimonialsSection = () => {
  return <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      
      {/* Section header */}
      <motion.div initial={{
      opacity: 0,
      y: 30
    }} whileInView={{
      opacity: 1,
      y: 0
    }} viewport={{
      once: true
    }} className="text-center mb-12 px-4 relative z-10">
        <span className="inline-block px-4 py-1.5 rounded-full bg-violet/20 text-violet text-sm font-medium mb-4">
          Depoimentos Reais
        </span>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          O Que Nossos <span className="text-gradient-violet">Clientes</span> Dizem
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Donos de depósito como você que já estão lucrando mais
        </p>
      </motion.div>

      {/* Infinite scroll container */}
      <div className="relative">
        {/* Gradient fade left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        {/* Gradient fade right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* First row - scrolls left */}
        <div className="flex mb-6 animate-scroll-left">
          {duplicatedTestimonials.map((testimonial, index) => <div key={`row1-${index}`} className="flex-shrink-0 w-[350px] mx-3 p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-violet/50 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet to-emerald flex items-center justify-center text-background font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed">"{testimonial.text}"</p>
              {/* Stars */}
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              </div>
            </div>)}
        </div>

        {/* Second row - scrolls right */}
        <div className="flex animate-scroll-right">
          {[...duplicatedTestimonials].reverse().map((testimonial, index) => (
            <div key={`row2-${index}`} className="flex-shrink-0 w-[350px] mx-3 p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm hover:border-violet/50 transition-colors duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald to-violet flex items-center justify-center text-background font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-foreground/80 leading-relaxed">"{testimonial.text}"</p>
              <div className="flex gap-1 mt-4">
                {[...Array(5)].map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;