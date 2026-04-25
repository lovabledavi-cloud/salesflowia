import { Bot, Repeat, Sparkles, MessageCircle, Calendar, Flame, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RevealSection from "./RevealSection";

const cards = [
  {
    number: "01",
    icon: <Bot className="w-6 h-6" />,
    accentIcon: <MessageCircle className="w-3.5 h-3.5" />,
    title: "Agente Inteligente",
    desc: "Atendimento em segundos para seu depósito. Humanizado ou robótico, você escolhe. Atende Facebook, Web, Insta e WhatsApp simultaneamente.",
    tag: "24/7 Multicanal",
  },
  {
    number: "02",
    icon: <Repeat className="w-6 h-6" />,
    accentIcon: <Calendar className="w-3.5 h-3.5" />,
    title: "Vendas e Recorrência",
    desc: "Cliente que comprou gás hoje tem anotação visual. O sistema sabe quando o botijão acaba e entra em contato automaticamente.",
    tag: "Receita previsível",
  },
  {
    number: "03",
    icon: <Sparkles className="w-6 h-6" />,
    accentIcon: <Flame className="w-3.5 h-3.5" />,
    title: "Resgate Automático",
    desc: "Recuperamos toda a base inativa do seu depósito com mensagens assertivas para quem precisa de gás.",
    tag: "+30% recuperação",
  },
];

const PainPointsSection = () => (
  <section className="py-24 bg-transparent">
    <RevealSection className="max-w-[1200px] mx-auto px-[5%]">
      <div className="text-center mb-16">
        <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.5rem)] tracking-tight mb-4 text-slate-900">
          Como transformamos clientes<br />
          <span className="text-orange-500" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", fontWeight: 600 }}>"esquecidos"</span> em lucro pro seu depósito
        </h2>
        <p className="text-lg text-slate-600">Seu depósito não precisa de mais atendentes, precisa de inteligência artificial com trato humano.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 80, rotateX: -25, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.7, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -8, transition: { duration: 0.3 } }}
            style={{ transformPerspective: 1000 }}
            className="group relative bg-white border border-slate-200 rounded-3xl p-8 pt-10 overflow-hidden hover:border-orange-400 hover:shadow-[0_25px_50px_-12px_rgba(249,115,22,0.18)] transition-all duration-500"
          >
            {/* Top accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Decorative big number watermark */}
            <span
              className="absolute -top-2 right-5 font-playfair italic text-[110px] leading-none text-orange-100 select-none pointer-events-none transition-all duration-500 group-hover:text-orange-200/80 group-hover:scale-110"
              aria-hidden
            >
              {card.number}
            </span>

            {/* Decorative corner glow */}
            <div className="absolute -bottom-16 -right-16 w-40 h-40 rounded-full bg-orange-500/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative z-10 flex flex-col gap-5">
              {/* Icon cluster — main + floating accent */}
              <div className="relative w-fit">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15 + 0.3, type: "spring", stiffness: 180 }}
                  className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white shadow-[0_10px_25px_-8px_rgba(249,115,22,0.6)] group-hover:rotate-6 transition-transform duration-500"
                >
                  {card.icon}
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: false, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: i * 0.15 + 0.55, type: "spring", stiffness: 220 }}
                  className="absolute -top-1.5 -right-2 w-7 h-7 rounded-full bg-white border border-orange-200 flex items-center justify-center text-orange-500 shadow-md"
                >
                  {card.accentIcon}
                </motion.div>
              </div>

              {/* Tag */}
              <span className="inline-flex items-center gap-1.5 self-start text-[10px] font-bold tracking-[0.15em] uppercase text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                {card.tag}
              </span>

              <h3 className="text-xl font-bold text-slate-900 leading-tight">{card.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{card.desc}</p>

              {/* Animated underline */}
              <div className="flex items-center gap-2 pt-2 mt-auto">
                <div className="h-px flex-1 bg-gradient-to-r from-orange-300 to-transparent" />
                <ArrowRight className="w-4 h-4 text-orange-500 transition-transform duration-500 group-hover:translate-x-1" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </RevealSection>
  </section>
);

export default PainPointsSection;
