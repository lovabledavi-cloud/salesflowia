import { motion } from "framer-motion";
import { Bot, Search, Send, Workflow } from "lucide-react";

const steps = [
  {
    step: 1,
    title: "A Conexão Inteligente",
    icon: Bot,
    description: "A gente conecta nossa Inteligência Artificial ao WhatsApp da sua revenda.",
    benefit: "Em 24 horas, a IA \"lê\" todo o histórico de conversas dos últimos meses. Ela aprende quem são seus clientes, com que frequência eles compram e como sua revenda se comunica. Sem precisar cadastrar nada manualmente.",
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
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-900/50 to-background" />
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Como transformamos contatos{" "}
            <span className="text-gradient-emerald">"esquecidos"</span>{" "}
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
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-1 bg-gradient-to-r from-emerald/20 via-emerald to-emerald/20 rounded-full" />
          
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
                <div className="relative h-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-emerald/30 transition-all duration-300 group">
                  {/* Step Number Badge */}
                  <div className="absolute -top-4 left-6 flex items-center gap-2">
                    <span className="bg-emerald text-background text-sm font-bold px-3 py-1 rounded-full">
                      PASSO {step.step}
                    </span>
                  </div>
                  
                  {/* Icon */}
                  <div className="mt-4 mb-6 flex justify-center">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald/20 blur-xl rounded-full group-hover:bg-emerald/30 transition-colors" />
                      <div className="relative w-16 h-16 bg-gradient-to-br from-emerald/20 to-emerald/5 rounded-2xl flex items-center justify-center border border-emerald/20 group-hover:scale-110 transition-transform duration-300">
                        <step.icon className="w-8 h-8 text-emerald" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-foreground mb-3 text-center">
                    {step.title}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-emerald mb-1">O que acontece:</p>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-emerald mb-1">O benefício:</p>
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
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-emerald/10 blur-3xl rounded-3xl" />
            
            {/* Card */}
            <div className="relative bg-gradient-to-br from-emerald/10 to-emerald/5 border border-emerald/30 rounded-2xl p-8 md:p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-emerald rounded-full" />
                <h3 className="text-2xl md:text-3xl font-bold text-foreground">
                  RESUMINDO: Onde está o aumento de lucro?
                </h3>
              </div>
              
              <div className="space-y-4 text-lg">
                <p className="text-muted-foreground">
                  <span className="text-red-400 font-medium">Hoje,</span> você só vende para quem lembra de te ligar{" "}
                  <span className="text-muted-foreground/70">(Demanda Passiva)</span>.
                </p>
                
                <p className="text-foreground">
                  <span className="text-emerald font-medium">Com o SalesFlowIA,</span> sua revenda passa a vender{" "}
                  <span className="font-semibold">ativamente</span> para quem já te conhece,{" "}
                  <span className="text-emerald font-semibold">24 horas por dia</span>, sem depender de funcionário extra.
                </p>
                
                <p className="text-xl md:text-2xl font-bold text-foreground pt-4 border-t border-emerald/20">
                  Nós tapamos o buraco por onde{" "}
                  <span className="text-gradient-emerald">30% do seu faturamento</span>{" "}
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
