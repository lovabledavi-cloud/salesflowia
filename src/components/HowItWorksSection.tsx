import { motion } from "framer-motion";
import { Database, Search, Send, Workflow, ArrowRight } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "A Importação da Base",
    subtitle: "(O \"Start\")",
    icon: Database,
    description: "Você não começa do zero. Nós pegamos a lista de clientes (Excel/CSV) do seu sistema de gestão atual e importamos para dentro do SalesFlowIA.",
    benefit: "O sistema organiza sua \"bagunça\". Ele centraliza o nome, telefone e data da última compra de cada cliente que já passou pela sua revenda.",
  },
  {
    step: 2,
    title: "O \"Raio-X\" da Base",
    icon: Search,
    description: "O sistema analisa os dados e identifica o padrão de compra.",
    benefit: "A IA gera uma lista automática de \"Oportunidades Imediatas\". Ela te diz: \"Estes 300 clientes sumiram há 60 dias. Tem R$ 30.000,00 parados aqui.\"",
  },
  {
    step: 3,
    title: "O Disparo Humanizado",
    icon: Send,
    description: "Você aprova a lista e o sistema começa a entrar em contato com esses clientes inativos, um por um.",
    benefit: "Mensagens personalizadas e humanizadas, em horários estratégicos, como se fosse seu melhor vendedor digitando.",
  },
  {
    step: 4,
    title: "O Funil de Vendas Automático",
    icon: Workflow,
    description: "O cliente respondeu? A IA assume o atendimento, negocia e joga o pedido pronto no seu painel de controle (Kanban).",
    benefit: "O sistema calcula quando o gás acaba e agenda a próxima oferta. O ciclo de venda recorrente nunca mais para.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-violet/5 to-background" />
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[600px] bg-violet/10 rounded-full blur-[200px]" />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-violet text-violet text-sm font-medium mb-6">
            Como Funciona
          </span>
          <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
            <span className="text-gradient-white">Como transformamos contatos </span>
            <span className="text-gradient-violet">"esquecidos"</span>
            <span className="text-gradient-white"> em lucro</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            O SalesFlowIA não é mágica. É um processo de{" "}
            <span className="text-violet font-semibold">4 etapas</span>{" "}
            que automatiza a busca ativa por clientes.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-20 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-violet/40 to-transparent" />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative group"
              >
                {/* Card */}
                <div className="relative h-full glass-card rounded-2xl p-6 border-gradient hover-lift transition-all duration-300">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-6">
                    <span className="bg-violet text-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg glow-violet-sm">
                      PASSO {step.step}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mt-4 mb-5 flex justify-center">
                    <motion.div 
                      className="relative"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.15 + 0.3 }}
                    >
                      <div className="absolute inset-0 bg-violet/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div 
                        className="relative w-14 h-14 bg-violet/20 rounded-xl flex items-center justify-center border border-violet/30"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <step.icon className="w-7 h-7 text-violet" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-1 text-center group-hover:text-violet transition-colors">
                    {step.title}
                  </h3>
                  {step.subtitle && (
                    <p className="text-xs text-violet/70 text-center mb-3">{step.subtitle}</p>
                  )}
                  
                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-xs font-medium text-violet mb-1 uppercase tracking-wide">O que acontece</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-emerald mb-1 uppercase tracking-wide">O benefício</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {step.benefit}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Arrow between cards - Desktop only */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:flex absolute top-20 -right-3 z-10">
                    <ArrowRight className="w-6 h-6 text-violet/50" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 md:mt-20"
        >
          <div className="relative max-w-4xl mx-auto">
            <div className="relative glass-card rounded-2xl p-8 md:p-10 border-gradient">
              {/* Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet/10 to-emerald/5 rounded-2xl" />
              
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-violet to-emerald rounded-full" />
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">
                    RESUMINDO: Onde está o aumento de lucro?
                  </h3>
                </div>
                
                <div className="space-y-4 text-base md:text-lg">
                  <p className="text-muted-foreground">
                    <span className="text-destructive font-medium">Hoje,</span> você só vende para quem lembra de te ligar{" "}
                    <span className="text-muted-foreground/60">(Demanda Passiva)</span>.
                  </p>
                  
                  <p className="text-foreground/90">
                    <span className="text-violet font-medium">Com o SalesFlowIA,</span> sua revenda passa a vender{" "}
                    <span className="font-semibold">ativamente</span> para quem já te conhece,{" "}
                    <span className="text-emerald font-medium">24 horas por dia</span>, sem depender de funcionário extra.
                  </p>
                  
                  <p className="text-lg md:text-xl font-semibold text-foreground pt-4 border-t border-border/30">
                    Nós tapamos o buraco por onde{" "}
                    <span className="text-gradient-violet">30% do seu faturamento</span>{" "}
                    vaza todos os meses.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;