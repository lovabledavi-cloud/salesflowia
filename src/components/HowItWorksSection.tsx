import { motion } from "framer-motion";
import { Database, Search, Send, Workflow } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "A Importação da Base",
    subtitle: "(O \"Start\")",
    icon: Database,
    description: "Você não começa do zero. Nós pegamos a lista de clientes (Excel/CSV) do seu sistema de gestão atual e importamos para dentro do SalesFlowIA.",
    benefit: "O sistema organiza sua \"bagunça\". Ele centraliza o nome, telefone e data da última compra de cada cliente que já passou pela sua revenda, preparando o terreno para a recuperação.",
  },
  {
    step: 2,
    title: "O \"Raio-X\" da Base",
    icon: Search,
    description: "O sistema analisa os dados e identifica o padrão de compra.",
    benefit: "A IA gera uma lista automática de \"Oportunidades Imediatas\". Ela te diz: \"Ei, estes 300 clientes aqui compravam todo mês e sumiram há 60 dias. Tem R$ 30.000,00 parados aqui.\" Você para de chutar e começa a mirar no lucro certo.",
  },
  {
    step: 3,
    title: "O Disparo Humanizado",
    icon: Send,
    description: "Você aprova a lista e o sistema começa a entrar em contato com esses clientes inativos, um por um.",
    benefit: "Esqueça listas de transmissão que ninguém lê. Nossa IA envia mensagens personalizadas e humanizadas, em horários estratégicos, como se fosse seu melhor vendedor digitando. Isso garante alta taxa de resposta e risco zero para seu chip.",
  },
  {
    step: 4,
    title: "O Funil de Vendas Automático",
    icon: Workflow,
    description: "O cliente respondeu? A IA assume o atendimento, negocia e joga o pedido pronto no seu painel de controle (Kanban).",
    benefit: "Sua equipe só se preocupa em entregar. E o melhor: assim que a venda é fechada, o sistema já calcula quando o gás desse cliente vai acabar de novo e agenda a próxima oferta. O ciclo de venda recorrente nunca mais para.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-orange-950/10 to-background" />
      <div className="absolute inset-0 bg-grid opacity-5" />
      
      <div className="container relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-16 md:mb-20"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-foreground">
            Como transformamos contatos{" "}
            <span className="text-orange-400">"esquecidos"</span>{" "}
            em lucro no seu caixa
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            O SalesFlowIA não é mágica. É um processo de{" "}
            <span className="text-emerald font-semibold">4 etapas</span>{" "}
            que automatiza a busca ativa por clientes na sua revenda.
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent rounded-full" />
          
          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Card */}
                <div className="relative h-full bg-card/30 backdrop-blur-sm border border-border/30 rounded-2xl p-6 hover:border-orange-500/20 hover:bg-card/50 transition-all duration-300 group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-6">
                    <span className="bg-orange-500/90 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-orange-500/20">
                      PASSO {step.step}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mt-4 mb-6 flex justify-center">
                    <motion.div 
                      className="relative"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 15,
                        delay: index * 0.15 + 0.3 
                      }}
                    >
                      <div className="absolute inset-0 bg-orange-500/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      <motion.div 
                        className="relative w-14 h-14 bg-orange-500/10 rounded-xl flex items-center justify-center border border-orange-500/20"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <step.icon className="w-7 h-7 text-orange-400" />
                      </motion.div>
                    </motion.div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-lg font-bold text-foreground mb-1 text-center">
                    {step.title}
                  </h3>
                  {step.subtitle && (
                    <p className="text-xs text-orange-400/70 text-center mb-3">{step.subtitle}</p>
                  )}
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <p className="text-xs font-medium text-orange-400 mb-1 uppercase tracking-wide">O que acontece</p>
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
            {/* Card */}
            <div className="relative bg-gradient-to-br from-purple-500/5 to-emerald/5 border border-orange-500/10 rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-emerald rounded-full" />
                <h3 className="text-xl md:text-2xl font-bold text-foreground">
                  RESUMINDO: Onde está o aumento de lucro?
                </h3>
              </div>
              
              <div className="space-y-4 text-base md:text-lg">
                <p className="text-muted-foreground">
                  <span className="text-red-400/80 font-medium">Hoje,</span> você só vende para quem lembra de te ligar{" "}
                  <span className="text-muted-foreground/60">(Demanda Passiva)</span>.
                </p>
                
                <p className="text-foreground/90">
                  <span className="text-orange-400 font-medium">Com o SalesFlowIA,</span> sua revenda passa a vender{" "}
                  <span className="font-semibold">ativamente</span> para quem já te conhece,{" "}
                  <span className="text-emerald font-medium">24 horas por dia</span>, sem depender de funcionário extra.
                </p>
                
                <p className="text-lg md:text-xl font-semibold text-foreground pt-4 border-t border-border/30">
                  Nós tapamos o buraco por onde{" "}
                  <span className="text-emerald">30% do seu faturamento</span>{" "}
                  vaza todos os meses.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
